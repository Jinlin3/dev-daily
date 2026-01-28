"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Handles submission of goals form
export async function submitGoals(formData: FormData) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error("You must be signed in to edit goals.");

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });

  if (!user) throw new Error("User not found.");
  const userId = user.id;

  const applications = Number(formData.get("job-applications"));
  const leetcode = Number(formData.get("leetcode"));
  const projectHours = Number(formData.get("project-hours"));

  const goals = await prisma.goals.upsert({
    where: { userId },
    update: {
      applications,
      leetcode,
      projectHours
    },
    create: {
      userId,
      applications,
      leetcode,
      projectHours
    }
  });

  console.log(`Submitted values: ${applications}, ${leetcode}, ${projectHours}`);

  redirect("/");
}
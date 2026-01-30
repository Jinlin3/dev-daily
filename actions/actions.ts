"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Simple helper function to get the current user or throw an error
export async function requireUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });

  if (!user) throw new Error("User not found.");
  return user; // { id, name, email }
}

// Handles submission of entry form
export async function submitEntry(formData: FormData) {
  // Handle session and get user
  const user = await requireUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const userId = user.id;

  const applications = Number(formData.get("job-applications"));
  const leetcode = Number(formData.get("leetcode"));
  const projectHours = Number(formData.get("project-hours"));

  const clientDate = formData.get("client-date") as string;
  if (typeof clientDate !== "string") {
    throw new Error("Missing client date.");
  }

  // Store midnight for today's date to avoid multiple entries on the same day.
  const today = new Date(clientDate);
  if (isNaN(today.getTime())) {
    throw new Error("Invalid client date.");
  }

  // Upsert the entry for today
  const entry = await prisma.entry.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      applications,
      leetcode,
      projectHours,
    },
    create: {
      userId,
      date: today,
      applications,
      leetcode,
      projectHours,
    },
  });

  console.log(`Submitted values: ${applications}, ${leetcode}, ${projectHours}`);
  revalidatePath("/");
}

// Handles submission of goals form
export async function submitGoals(formData: FormData) {
  // Handle session and get user
  const user = await requireUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

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
"use server";

import { auth } from "@/auth";
// This file defines server actions.

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Utility function to create slugs from titles.
function makeSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFKD")                 // handle accents
    .replace(/[\u0300-\u036f]/g, "")   // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "")      // remove unsafe chars
    .replace(/\s+/g, "-")              // spaces → hyphens
    .replace(/-+/g, "-");              // collapse dashes
}

// Ensures the slug is unique by appending a counter if necessary.
async function generateUniqueSlug(title: string) {
  const base = makeSlug(title);

  if (!base) return "";

  let slug = base;
  let count = 1;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${base}-${count++}`;
  }

  return slug;
}

// Handles the creation of a post.
export async function createPost(formData: FormData) {
  // Ensure the user is signed in
  const session = await auth();
  const email = session?.user?.email;
  const name = session?.user?.name;
  if (!email) throw new Error("You must be signed in to create a post.");

  const rawTitle = String(formData.get("title") ?? "");
  const rawContent = String(formData.get("content") ?? "");
  const title = rawTitle.trim();
  const content = rawContent.trim();
  const generatedSlug = await generateUniqueSlug(title);
  if (!generatedSlug) throw new Error("Could not generate a valid slug from the title.");

  // Handles empty title or content
  if (title.length === 0) throw new Error("Title cannot be empty.");
  if (content.length === 0) throw new Error("Content cannot be empty.");

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  await prisma.post.create({
    data: {
      title,
      content,
      slug: await generateUniqueSlug(title),
      authorId: user.id,
    },
  });

  revalidatePath("/");
}

// Handles editing a post. Needs id as an identifier.
export async function editPost(formData: FormData, id: number) {
  await prisma.post.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: (formData.get("title") as string).replace(/\s+/g, "-").toLowerCase(),
      content: formData.get("content") as string,
      published: true,
    }
  });
}

// Handles deleting a post given an id.
export async function deletePost(formData: FormData) {
  const slug = formData.get("slug")?.toString();
  if (!slug) throw new Error("Missing slug");
  await prisma.post.delete({
    where: {
      slug
    }
  });
  // automatically refreshes posts page when this function is ran
  revalidatePath("/");
  // redirects to home page
  redirect("/");
}

export async function submitValue(formData: FormData) {
  const jobApplications = Number(formData.get("job-applications"));
  const leetcodeProblems = Number(formData.get("leetcode"));
  const projectHours = Number(formData.get("project-hours"));
  console.log(`Submitted values: ${jobApplications}, ${leetcodeProblems}, ${projectHours}`);
}
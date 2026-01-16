"use server";

// This file defines server actions.

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Handles the creation of a post.
export async function createPost(formData: FormData) {
  try {
    // Check if title and content is actually filled out.
    if (formData.get("title")?.toString().trim().length === 0 || formData.get("content")?.toString().trim().length === 0) {
      throw new Error("Title or content is blank.");
    }
    // Otherwise create post.
    await prisma.post.create({
      data: {
        title: formData.get("title") as string,
        slug: (formData.get("title") as string).replace(/\s+/g, "-").toLowerCase(),
        content: formData.get("content") as string,
        published: true,
        author: {
          connectOrCreate: {
            where: {
              email: "hellojjlin@gmail.com"
            },
            create: {
              email: "hellojjlin@gmail.com",
              hashedPassword: "abcdefg",
            },
          }
        },
      }
    });
    // automatically refreshes posts page when this function is ran
    revalidatePath("/posts");
  } catch (e) {
    console.error("createPost failed:", e);
  }
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
  redirect("/");
}
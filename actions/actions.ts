"use server";

// This file defines server actions.

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Handles the creation of a post.
export async function createPost(formData: FormData) {
  await prisma.post.create({
    data: {
      title: formData.get("title") as string,
      slug: (formData.get("title") as string).replace(/\s+/g, "-").toLowerCase(),
      content: formData.get("content") as string,
      published: true,
      author: {
        connect: {
          email: "hellojjlin@gmail.com",
        }
      },
    }
  });

  // automatically refreshes posts page when this function is ran
  revalidatePath("/posts");
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
export async function deletePost(id: number) {
  await prisma.post.delete({
    where: { id },
  });
}
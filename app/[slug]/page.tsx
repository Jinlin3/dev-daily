import { deletePost } from "@/actions/actions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <p className="bg-white px-10 py-5 rounded-2xl min-w-75 max-w-125 min-h-32 flex items-center justify-center">{post.content}</p>
      <form action={deletePost}>
        <input type="hidden" name="slug" value={slug} />
        <button type="submit" className="bg-red-400 text-white rounded-sm px-4 py-2 hover:bg-red-500 cursor-pointer">Delete Post</button>
      </form>
      
    </main>
  );
}
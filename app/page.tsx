import { createPost } from "@/actions/actions";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <form action={createPost} className="flex flex-col gap-y-2 w-96">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="px-2 py-1 rounded-sm bg-white"
        />
        <textarea
          name="content" 
          rows={5}
          placeholder="Content"
          className="px-2 py-1 rounded-sm bg-white"
        />
        <button
          type="submit"
          className="bg-blue-400 rounded-sm py-2 text-white"
        >
          Create Post
        </button>
      </form>
      <Link href="/posts" className="mt-4 border rounded px-6 py-3 text-lg transition hover:bg-gray-100 hover:shadow-md active:scale-95">
        View Blogs
      </Link>
    </main>
  );
}

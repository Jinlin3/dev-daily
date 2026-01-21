import { createPost } from '@/actions/actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {

  // Allows the author's email to be fetched along with posts
  const allPosts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          email: true,
        }
      }
    }
  });

  // total number of posts in the database
  const postsCount = await prisma.post.count();

  return (
    <main className="flex flex-col items-center gap-y-5 pt-10 text-center">
      <h1 className="text-3xl font-semibold">All Posts ({postsCount})</h1>
      <div className="border-t border-b border-black/10 grid grid-cols-3 gap-x-10 gap-y-10 mb-5 p-5 min-w-4xl min-h-80">
        {allPosts && allPosts.map((post) => (
          <Link href={`/${post.slug}`} key={post.id} className="p-5 bg-white rounded-2xl flex flex-col items-center justify-center hover:shadow-md">
            <div>{post.title}</div>
            <div className="italic">by {post.author.email}</div>
          </Link>
        ))}
      </div>

      <form action={createPost} className="flex flex-col gap-y-2 w-96">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="px-2 py-1 rounded-sm bg-white"
          required
        />
        <textarea
          name="content" 
          rows={5}
          placeholder="Content"
          className="px-2 py-1 rounded-sm bg-white"
          required
        />
        <button
          type="submit"
          className="bg-blue-400 rounded-sm py-2 hover:bg-blue-500 text-white cursor-pointer"
        >
          Create Post
        </button>
      </form>
    </main>
  );
}
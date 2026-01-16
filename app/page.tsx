import { createPost } from '@/actions/actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {

  const jj = await prisma.user.findUnique({
    where: {
      email: "hellojjlin@gmail.com",
    },
    include: {
      posts: true,
    },
  });

  // total number of posts in the database
  const jjPostsCount = await prisma.post.count({
    where: {
      author: {
        email: "hellojjlin@gmail.com",
      },
    }
  });

  return (
    <main className="flex flex-col items-center gap-y-5 pt-10 text-center">
      <h1 className="text-3xl font-semibold">All of JJ's Posts ({jjPostsCount})</h1>
      <ul className="border-t border-b border-black/10 py-5 leading-8">
        {jj && jj.posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between px-5">
            <Link href={`/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>

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
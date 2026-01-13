import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function PostsPage() {

  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  // total number of posts in the database
  const postsCount = await prisma.post.count();
  // Testing out findUnique(); doesn't do anything dw
  const marioPost = await prisma.post.findUnique({
    where: {
      slug: "mario",
    }
  });

  return (
    <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">All Posts ({postsCount})</h1>
      <ul className="border-t border-b border-black/10 py-5 leading-8">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between px-5">
            <Link href={`/posts/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
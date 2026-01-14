import "dotenv/config";
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const initialPosts: Prisma.PostCreateInput[] = [
  {
    title: "Post 1",
    slug: "post-1",
    content: "Content of post 1",
    author: {
      connectOrCreate: {
        where: {
          email: "hellojjlin@gmail.com",
        },
        create: {
          email: "hellojjlin@gmail.com",
          hashedPassword: "abcdefg",
        }
      }
    }
  }
];

async function main() {
  console.log(`Start seeding...`);
  for (const post of initialPosts) {
    const newPost = await prisma.post.create({
      data: post,
    });
    console.log(`Created post with id: ${newPost.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
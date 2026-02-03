import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { slugFromEmail } from "./actions/actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  events: {
    async createUser({ user }) {
      if (!user.id || !user.email) return;

      const slug = await slugFromEmail(user.email);

      // Initialize goals and set slug within a transaction
      await prisma.$transaction([
        prisma.goals.create({
          data: {
            userId: user.id
          }
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { slug }
        })
      ]);
      console.log(`Created user with slug: ${slug}`);
    }
  }
});
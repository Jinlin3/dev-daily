import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  events: {
    async createUser({ user }) {
      // NextAuth's TS types sometimes make user.id optional, so guard:
      if (!user.id) return;
      await prisma.goals.create({ data: { userId: user.id } });
    }
  }
});
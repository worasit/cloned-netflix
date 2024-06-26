import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prismaDb from "@/lib/prismadb";
import { User } from "@prisma/client";

export default NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'password'
        }

      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and Password required');
        }
        const user: User = await prismaDb.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        if (!user || !user.hashedPassword) {
          throw Error("Email doesn't exist");
        }
        const isCorrectPassword = await compare(credentials.password, user.hashedPassword);
        if (!isCorrectPassword) {
          throw new Error('Incorrect Password');
        }
        return user;
      }
    })
  ],
  pages: { signIn: '/auth' },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

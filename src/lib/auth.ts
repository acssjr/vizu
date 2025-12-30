import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID'] ?? '',
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] ?? '',
    }),
    EmailProvider({
      server: {
        host: process.env['EMAIL_SERVER_HOST'],
        port: process.env['EMAIL_SERVER_PORT'],
        auth: {
          user: process.env['EMAIL_SERVER_USER'],
          pass: process.env['EMAIL_SERVER_PASSWORD'],
        },
      },
      from: process.env['EMAIL_FROM'] ?? 'noreply@vizu.com.br',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/verify',
    newUser: '/dashboard',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token['id'] = user.id;
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      // Set initial karma for new users
      await prisma.user.update({
        where: { id: user.id },
        data: {
          karma: 50,
          credits: 0,
        },
      });
    },
  },
};

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

const isDev = process.env.NODE_ENV === 'development';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID'] ?? '',
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] ?? '',
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase();
        const password = credentials.password;

        // Development-only: Check for dev user credentials
        if (isDev) {
          const devEmail = process.env['DEV_USER_EMAIL'];
          const devPassword = process.env['DEV_USER_PASSWORD'];

          if (devEmail && devPassword && email === devEmail && password === devPassword) {
            // Find or create dev user
            let user = await prisma.user.findUnique({
              where: { email: devEmail },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  email: devEmail,
                  name: 'Dev User',
                  karma: 50,
                  credits: 100,
                },
              });
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
        }

        // Regular credentials auth: find user and verify password
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
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

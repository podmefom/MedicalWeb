// Загружаем переменные окружения в первую очередь
if (!process.env.DATABASE_URL) {
  require('dotenv').config();
}

import NextAuth, { type NextAuthOptions, type Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[AUTH PROVIDER] authorize called');
        console.log('[AUTH PROVIDER] credentials:', credentials);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] Email и пароль обязательны');
          throw new Error('Email и пароль обязательны');
        }

        console.log('[AUTH] Попытка входа с email:', credentials.email);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          console.log('[AUTH] Пользователь не найден:', credentials.email);
          throw new Error('Пользователь не найден');
        }

        console.log('[AUTH] Пользователь найден:', user.email, 'role:', user.role);

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        console.log('[AUTH] Пароль:', passwordMatch);

        if (!passwordMatch) {
          console.log('[AUTH] Неверный пароль для:', credentials.email);
          throw new Error('Неверный пароль');
        }

        console.log('[AUTH] Успешный вход:', credentials.email);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      console.log('[AUTH JWT] token:', token.email, 'user:', user?.email);
      if (user) {
        token.role = user.role || 'PATIENT';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      console.log('[AUTH SESSION] session:', session.user?.email, 'token:', token.email);
      if (session && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

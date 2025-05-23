import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { addUser } from '@/service/user';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({user: { id, name, image, email}}) {
      if (!email) {
        return false;
      }
      addUser({ 
        id,
        name: name || '', 
        image, 
        email, 
        username: email.split('@')[0]
      })
      return true;
    },

    async session({ session, token }) {
      const user = session?.user;

      if (user) {
        session.user = {
          ...user,
          username: user.email?.split('@')[0],
          id: token.id as string
        }
      }
      
      return session
    },
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
      }

      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    },
  }
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
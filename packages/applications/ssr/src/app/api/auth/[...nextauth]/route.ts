import { authConfiguration } from '@/config/authConfiguration';
import NextAuth from 'next-auth';

const handler = NextAuth(authConfiguration);

export { handler as GET, handler as POST };

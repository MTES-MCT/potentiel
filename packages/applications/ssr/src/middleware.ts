import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/auth/signIn' },
});

export const config = { matcher: ['/((?!auth).*)'] };

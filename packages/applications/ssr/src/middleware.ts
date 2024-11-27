import { withAuth } from 'next-auth/middleware';

export default withAuth({
  // NB: importing Routes is not working in the middleware
  pages: { signIn: '/auth/signIn' },
  callbacks: {
    authorized: ({ token }) => !!token?.utilisateur,
  },
});

export const config = {
  // do not run middleware for paths matching one of following
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|illustrations|$).*)',
  ],
};

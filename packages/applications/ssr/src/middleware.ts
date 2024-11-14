import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/auth/signIn' },
});

export const config = {
  // do not run middleware for paths matching one of following
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|illustrations|$).*)',
  ],
};

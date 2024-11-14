import { withAuth } from 'next-auth/middleware';

import { Routes } from '@potentiel-applications/routes';

export default withAuth({
  pages: { signIn: Routes.Auth.signIn() },
});

export const config = {
  // do not run middleware for paths matching one of following
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|illustrations|$).*)',
  ],
};

import { chain } from './middlewares/chain';
import { withNextAuth } from './middlewares/withNextAuth';
import { withCSRF } from './middlewares/withCSRF';

export default chain([withNextAuth, withCSRF]);

export const config = {
  // do not run middleware for paths matching one of following
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|illustrations|error|statistiques-publiques|accessibilite|$).*)',
  ],
};

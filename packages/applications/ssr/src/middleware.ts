import { chain } from './middlewares/chain';
import { withAuth } from './middlewares/withAuth';
import { withCSRF } from './middlewares/withCSRF';

export default chain([withAuth, withCSRF]);

export const config = {
  runtime: 'nodejs',
  // do not run middleware for paths matching one of following
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|illustrations|error|statistiques-publiques|$).*)',
  ],
};

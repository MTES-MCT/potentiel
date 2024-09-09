import { chain } from '@/middlewares/chain';
import { withAuthMiddleware } from '@/middlewares/withAuthMiddleware';

export default chain([withAuthMiddleware]);

export const config = {
  // do not run middleware for paths matching one of following
  matcher: ['/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|$).*)'],
};

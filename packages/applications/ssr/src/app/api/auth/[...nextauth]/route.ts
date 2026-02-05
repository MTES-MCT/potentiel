import NextAuth from 'next-auth';

import { authOptions } from '@potentiel-applications/request-context';

const handler = NextAuth({
  ...authOptions,
  // hack à supprimer quand l'adapter auth-pg-adapter sera retiré
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: authOptions.adapter as any,
});

export { handler as GET, handler as POST };

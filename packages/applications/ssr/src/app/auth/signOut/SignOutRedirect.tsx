'use client';
import { useEffect } from 'react';

import { authClient } from '@/auth/client';

type SignOutRedirectProps = {
  callbackUrl: string | undefined;
};
export const SignOutRedirect = ({ callbackUrl }: SignOutRedirectProps) => {
  const { isPending, data } = authClient.useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }

    void window.cookieStore.delete('x-potentiel-impersonate');

    if (data?.user) {
      authClient.signOut().then(() => {
        window.location.href = callbackUrl ?? '/';
      });
    } else {
      window.location.href = callbackUrl ?? '/';
    }
  }, [isPending, data, callbackUrl]);
  return null;
};

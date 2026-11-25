'use client';
import { useEffect } from 'react';

import { authClient } from '@/auth/client';
import { impersonateCookieOptions } from '@/auth/constants';

type SignOutRedirectProps = {
  callbackUrl: string | undefined;
};
export const SignOutRedirect = ({ callbackUrl }: SignOutRedirectProps) => {
  const { isPending, data } = authClient.useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }

    void window.cookieStore.delete(impersonateCookieOptions);

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

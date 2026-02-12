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
    if (data?.user) {
      authClient.signOut().then(() => {
        window.location.href = callbackUrl || '/';
      });
    } else {
      window.location.href = callbackUrl || '/';
    }
  }, [isPending, data]);
  return null;
};

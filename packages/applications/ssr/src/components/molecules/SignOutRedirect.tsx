'use client';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type SignOutRedirectProps = {
  callbackUrl: string | undefined;
};
export const SignOutRedirect = ({ callbackUrl }: SignOutRedirectProps) => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      return router.push('/');
    }
    if (status === 'authenticated') {
      signOut().then(() => router.push(callbackUrl ?? '/'));
    }
  }, [status]);

  return null;
};

'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type SignOutRedirectProps = {
  callbackUrl: string | undefined;
};
export const SignOutRedirect = ({ callbackUrl }: SignOutRedirectProps) => {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => signOut({}).then(() => router.push(callbackUrl ?? '/')), 500);
    return () => clearTimeout(timeout);
  }, []);

  return null;
};

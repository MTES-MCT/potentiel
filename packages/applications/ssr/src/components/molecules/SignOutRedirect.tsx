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
    signOut({}).then(() => router.push(callbackUrl ?? '/'));
  }, []);

  return null;
};

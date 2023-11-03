'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SignIn() {
  const params = useSearchParams();
  const { status } = useSession();

  useEffect(() => {
    const autoSigning = async () => {
      await delay(1500);

      const callbackUrl = params.get('callbackUrl') ?? '/';

      if (status === 'unauthenticated') {
        signIn('keycloak', { callbackUrl });
      }

      if (status === 'authenticated') {
        redirect(callbackUrl);
      }
    };
    autoSigning();
  }, [status, params]);

  return (
    <div className="flex m-auto">
      <div className="font-bold text-2xl">Authentification en cours, merci de patienter ...</div>
    </div>
  );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

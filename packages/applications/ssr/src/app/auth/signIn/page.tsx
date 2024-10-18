'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';

export default function SignIn() {
  const params = useSearchParams();
  const { status } = useSession();
  const callbackUrl = params.get('callbackUrl') ?? '/';

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      redirect(callbackUrl);
    }
    if (status === 'unauthenticated') {
      signIn('keycloak', { callbackUrl });
    }
  }, [status, callbackUrl]);

  return (
    <PageTemplate>
      <div className="flex m-auto">
        <div className="font-bold text-2xl">Authentification en cours, merci de patienter ...</div>
      </div>
    </PageTemplate>
  );
}

'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';

export default function SignIn() {
  const params = useSearchParams();
  const { status, data } = useSession();
  const callbackUrl = params.get('callbackUrl') ?? Routes.Auth.redirectToDashboard();

  useEffect(() => {
    switch (status) {
      case 'authenticated':
        // This checks that the session is up to date with the necessary requirements
        // it's useful when changing what's inside the cookie for instance
        if (!data.accessToken) {
          redirect(Routes.Auth.signOut(callbackUrl));
          break;
        }
        redirect(callbackUrl);
        break;
      case 'unauthenticated':
        signIn('keycloak', { callbackUrl });
    }
  }, [status, callbackUrl, data]);

  return (
    <PageTemplate>
      <div className="flex m-auto">
        <div className="font-bold text-2xl">Authentification en cours, merci de patienter ...</div>
      </div>
    </PageTemplate>
  );
}

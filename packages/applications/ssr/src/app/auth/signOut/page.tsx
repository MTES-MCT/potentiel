'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';

export default function SignIn() {
  useEffect(() => {
    const autoSignout = async () => {
      await delay(1500);

      signOut({ callbackUrl: '/logout' });
    };

    autoSignout();
  });

  return (
    <PageTemplate>
      <div className="flex m-auto">
        <div className="font-bold text-2xl">Déconnexion en cours, merci de patienter ...</div>
      </div>
    </PageTemplate>
  );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

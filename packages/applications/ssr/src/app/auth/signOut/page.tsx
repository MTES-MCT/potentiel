'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';

export default function SignOut() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <PageTemplate>
      <div className="flex m-auto">
        <div className="font-bold text-2xl">Déconnexion en cours, merci de patienter ...</div>
      </div>
    </PageTemplate>
  );
}

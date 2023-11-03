'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function SignIn() {
  useEffect(() => {
    const autoSignout = async () => {
      await delay(1500);

      signOut({ callbackUrl: '/logout' });
    };

    autoSignout();
  });

  return (
    <div className="flex m-auto">
      <div className="font-bold text-2xl">Déconnexion en cours, merci de patienter ...</div>
    </div>
  );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

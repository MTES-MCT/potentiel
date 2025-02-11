'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import ProConnectButton from '@codegouvfr/react-dsfr/ProConnectButton';
import Tile from '@codegouvfr/react-dsfr/Tile';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';

export default function SignIn() {
  const params = useSearchParams();
  const { status, data } = useSession();
  const callbackUrl = params.get('callbackUrl') ?? Routes.Auth.redirectToDashboard();

  useEffect(() => {
    if (status === 'authenticated') {
      // This checks that the session is up to date with the necessary requirements
      // it's useful when changing what's inside the cookie for instance
      if (!data.utilisateur) {
        redirect(Routes.Auth.signOut(callbackUrl));
      }

      redirect(callbackUrl);
    }
  }, [status, callbackUrl, data]);

  return (
    <PageTemplate>
      <Heading1>Identifiez-vous</Heading1>
      <div className="flex flex-col items-center gap-6 mt-12 md:mt-20">
        <Tile
          className="md:w-2/3"
          title="ProConnect"
          detail={
            <div className="flex flex-col gap-4">
              <p>Connectez-vous facilement à l'aide de votre adresse professionnelle</p>
              <ProConnectButton onClick={() => signIn('proconnect', { callbackUrl })} />
            </div>
          }
        />
        <Tile
          className="md:w-2/3"
          title="Mot de passe"
          detail={
            <div className="flex flex-col gap-4">
              <p>Vous pouvez toujours vous connecter à l'aide de vos identifiants classiques</p>
              <Button className="mx-auto" onClick={() => signIn('keycloak', { callbackUrl })}>
                Connexion avec mot de passe
              </Button>
            </div>
          }
        />
      </div>
    </PageTemplate>
  );
}

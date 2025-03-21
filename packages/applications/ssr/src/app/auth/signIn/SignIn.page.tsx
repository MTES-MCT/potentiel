'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import ProConnectButton from '@codegouvfr/react-dsfr/ProConnectButton';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Tile from '@codegouvfr/react-dsfr/Tile';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { MagicLinkForm } from '@/components/organisms/auth/MagicLinkForm';

type SignInPageProps = {
  providers: Array<string>;
};

export default function SignInPage({ providers }: SignInPageProps) {
  const { status, data } = useSession();

  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? Routes.Auth.redirectToDashboard();
  const error = params.get('error');

  const onlyKeycloak = providers.length === 1 && providers.includes('keycloak');

  useEffect(() => {
    switch (status) {
      case 'authenticated':
        // This checks that the session is up to date with the necessary requirements
        // it's useful when changing what's inside the cookie for instance
        if (!data.utilisateur) {
          redirect(Routes.Auth.signOut({ callbackUrl }));
          break;
        }
        redirect(callbackUrl);
        break;

      case 'unauthenticated':
        if (onlyKeycloak) {
          setTimeout(() => signIn('keycloak', { callbackUrl }), 2000);
        }

        break;
    }
  }, [status, callbackUrl, data]);

  return (
    <PageTemplate>
      {onlyKeycloak ? (
        <div className="font-bold text-2xl">Authentification en cours ...</div>
      ) : (
        <>
          <Heading1>Identifiez-vous</Heading1>
          <div className="flex flex-col mt-12 gap-6 items-center">
            {error && (
              <Alert
                className="md:w-2/3"
                severity="error"
                small
                description="Une erreur est survenue. Si le problème persiste vous pouvez nous contacter"
                closable
              />
            )}
            <div className="flex flex-col md:flex-row gap-5">
              {providers.includes('proconnect') && (
                <Tile
                  title="ProConnect"
                  desc="Connectez-vous facilement à l'aide de votre adresse professionnelle"
                  detail={
                    <ProConnectButton onClick={() => signIn('proconnect', { callbackUrl })} />
                  }
                  className="flex-1"
                />
              )}

              {providers.includes('email') && (
                <Tile
                  title="Lien magique"
                  desc="Connectez-vous facilement sans mot de passe à l'aide d'un lien magique qui sera envoyé sur votre adresse de courriel"
                  detail={<MagicLinkForm callbackUrl={callbackUrl} />}
                  className="flex-1"
                />
              )}

              {providers.includes('keycloak') && (
                <Tile
                  title="Mot de passe"
                  desc="Vous pouvez toujours vous connecter à l'aide de vos identifiants classiques"
                  detail={
                    <Button className="mx-auto" onClick={() => signIn('keycloak', { callbackUrl })}>
                      Connexion avec mot de passe
                    </Button>
                  }
                  className="flex-1"
                />
              )}
            </div>
          </div>
        </>
      )}
    </PageTemplate>
  );
}

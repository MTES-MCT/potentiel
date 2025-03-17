'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import ProConnectButton from '@codegouvfr/react-dsfr/ProConnectButton';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { LoginMethodTile } from '@/components/organisms/auth/LoginMethodTile';

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

  const [email, setEmail] = useState('');

  return (
    <PageTemplate>
      {onlyKeycloak ? (
        <div className="font-bold text-2xl">Authentification en cours ...</div>
      ) : (
        <div className="flex flex-col items-center gap-6 mt-12 md:mt-20">
          <Heading1>Identifiez-vous</Heading1>

          {error && (
            <Alert
              className="md:w-2/3"
              severity="error"
              small
              description="Une erreur est survenue. Si le problème persiste vous pouvez nous contacter"
              closable
            />
          )}
          {providers.includes('proconnect') && (
            <LoginMethodTile
              title="ProConnect"
              description="Connectez-vous facilement à l'aide de votre adresse professionnelle"
            >
              <ProConnectButton onClick={() => signIn('proconnect', { callbackUrl })} />
            </LoginMethodTile>
          )}

          {providers.includes('email') && (
            <LoginMethodTile
              title="Lien magique"
              description="Connectez-vous facilement sans mot de passe à l'aide d'un lien magique qui sera envoyé sur votre adresse de courriel"
            >
              <form
                className="md:mx-24 w-full lg:w-8/12"
                action="javascript:void(0);"
                onSubmit={() => signIn('email', { callbackUrl, email })}
              >
                <Input
                  label="Email"
                  nativeInputProps={{
                    type: 'email',
                    name: 'email',
                    required: true,
                    onChange: (e) => setEmail(e.target.value),
                  }}
                />
                <Button type="submit" className="mx-auto">
                  Envoyer le lien magique
                </Button>
              </form>
            </LoginMethodTile>
          )}

          {providers.includes('keycloak') && (
            <LoginMethodTile
              title="Mot de passe"
              description="Vous pouvez toujours vous connecter à l'aide de vos identifiants classiques"
            >
              <Button className="mx-auto" onClick={() => signIn('keycloak', { callbackUrl })}>
                Connexion avec mot de passe
              </Button>
            </LoginMethodTile>
          )}
        </div>
      )}
    </PageTemplate>
  );
}

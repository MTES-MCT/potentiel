'use client';

import ProConnectButton from '@codegouvfr/react-dsfr/ProConnectButton';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { AuthTile, ProviderProps } from '@/components/organisms/auth/AuthTile';
import { MagicLinkForm } from '@/components/organisms/auth/MagicLinkForm';
import { authClient } from '@/auth/client';
import { AuthProvider } from '@/auth/providers/authProvider';

type SignInPageProps = {
  providers: Partial<Record<AuthProvider, ProviderProps>>;
  callbackUrl: string;
  forceProConnect?: boolean;
};

export default function SignInPage({ providers, callbackUrl, forceProConnect }: SignInPageProps) {
  const { isPending, data } = authClient.useSession();
  const router = useRouter();

  if (!isPending && !data?.user && forceProConnect) {
    authClient.signIn.oauth2({ providerId: 'proconnect', callbackURL: callbackUrl });
  }

  return (
    <PageTemplate>
      <Heading1>Identifiez-vous</Heading1>
      <div className="flex flex-col mt-12 gap-6 items-center">
        <div className="flex flex-wrap gap-5 justify-center">
          {providers.proconnect && (
            <AuthTile
              title="ProConnect"
              provider={providers.proconnect}
              profiles={{ porteurs: true, dreal: true, dgec: true, autres: true }}
              description={"Connectez-vous facilement à l'aide de votre adresse professionnelle"}
              action={
                <ProConnectButton
                  onClick={() =>
                    authClient.signIn.oauth2({ providerId: 'proconnect', callbackURL: callbackUrl })
                  }
                />
              }
              className="flex-1"
            />
          )}

          {providers['magic-link'] && (
            <AuthTile
              title="Lien magique"
              provider={providers['magic-link']}
              profiles={{ porteurs: true, dreal: false, dgec: false, autres: true }}
              description={
                "Connectez-vous facilement sans mot de passe à l'aide d'un lien magique qui sera envoyé sur votre adresse de courriel"
              }
              action={
                <MagicLinkForm
                  onSubmit={async (email) => {
                    await authClient.signIn.magicLink({ callbackURL: callbackUrl, email });
                    router.push(Routes.Auth.verifyRequest());
                  }}
                />
              }
              className="flex-1"
            />
          )}

          {providers.keycloak && (
            <AuthTile
              title="Mot de passe"
              provider={providers.keycloak}
              profiles={{ porteurs: true, dreal: false, dgec: false, autres: true }}
              description={
                "Vous pouvez toujours vous connecter à l'aide de vos identifiants classiques"
              }
              action={
                <Button
                  className="mx-auto"
                  onClick={() =>
                    authClient.signIn.oauth2({ providerId: 'keycloak', callbackURL: callbackUrl })
                  }
                >
                  Connexion avec mot de passe
                </Button>
              }
              className="flex-1 lg:flex-none"
            />
          )}
        </div>
      </div>
      <div className="text-right italic mt-2">
        * Autres Partenaires : CRE, Ademe, Caisse des dépôts, Gestionnaire de Réseau, Co-contractant
      </div>
    </PageTemplate>
  );
}

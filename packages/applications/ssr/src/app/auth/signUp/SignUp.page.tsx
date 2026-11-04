'use client';

import Notice from '@codegouvfr/react-dsfr/Notice';
import ProConnectButton from '@codegouvfr/react-dsfr/ProConnectButton';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { authClient } from '@/auth/client';
import type { AuthProvider } from '@/auth/providers/authProvider';
import { Heading1 } from '@/components/atoms/headings';
import { AuthTile, type ProviderProps } from '@/components/organisms/auth/AuthTile';
import { MagicLinkForm } from '@/components/organisms/auth/MagicLinkForm';
import { PageTemplate } from '@/components/templates/Page.template';

type SignUpPageProps = {
  providers: Partial<Record<AuthProvider, ProviderProps>>;
  callbackUrl: string;
  error?: string;
};

export default function SignUpPage({ providers, callbackUrl, error }: SignUpPageProps) {
  const router = useRouter();

  return (
    <PageTemplate>
      <Heading1>Inscrivez-vous</Heading1>
      <div className="flex flex-col gap-4">
        <Notice
          title=""
          severity="info"
          description="L'inscription autonome n'est possible qu'en tant que Porteur de Projet. Vous êtes
          partenaire ?"
          link={{
            text: 'Contactez-nous par email',
            linkProps: {
              href: 'mailto:contact@potentiel.beta.gouv.fr',
            },
          }}
        />
        {error && (
          <Notice
            className="md:w-2/3"
            title="Une erreur est survenue"
            severity="alert"
            description="Si le problème persiste, vous pouvez nous contacter."
            isClosable
          />
        )}
        <div className="flex flex-wrap gap-6 justify-center">
          {providers.proconnect && (
            <AuthTile
              title="ProConnect"
              provider={providers.proconnect}
              description="Inscrivez-vous facilement à l'aide de votre adresse professionnelle"
              action={
                <ProConnectButton
                  onClick={() =>
                    authClient.signIn.oauth2({
                      providerId: 'proconnect',
                      callbackURL: callbackUrl,
                    })
                  }
                />
              }
              className="w-full md:flex-1"
            />
          )}

          {providers['magic-link'] && (
            <AuthTile
              title="Lien magique"
              provider={providers['magic-link']}
              description="Inscrivez-vous facilement sans mot de passe à l'aide d'un lien magique qui sera envoyé sur votre adresse de courriel"
              action={
                <MagicLinkForm
                  onSubmit={async (email) => {
                    await authClient.signIn.magicLink({ callbackURL: callbackUrl, email });
                    router.push(Routes.Auth.verifyRequest());
                  }}
                />
              }
              className="w-full md:flex-1"
            />
          )}
        </div>
      </div>
      <div className="text-right italic mt-2">
        * Autres Partenaires : Caisse des dépôts, Gestionnaire de Réseau, Cocontractant
      </div>
    </PageTemplate>
  );
}

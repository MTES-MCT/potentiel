'use client';

import ProConnectButton from '@codegouvfr/react-dsfr/ProConnectButton';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { MagicLinkForm } from '@/components/organisms/auth/MagicLinkForm';
import { authClient } from '@/auth/client';
import { AuthTile, ProviderProps } from '@/components/organisms/auth/AuthTile';
import { AuthProvider } from '@/auth/providers/authProvider';

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
      <div className="flex flex-col">
        <p className="mb-6">
          L'inscription autonome n'est possible qu'en tant que Porteur de Projet. Vous êtes
          partenaire ?
          <Link href="mailto:contact@potentiel.beta.gouv.fr" className="ml-2">
            Contactez-nous
          </Link>
        </p>

        {error && (
          <Alert
            className="md:w-2/3"
            severity="error"
            small
            description="Une erreur est survenue. Si le problème persiste vous pouvez nous contacter"
            closable
          />
        )}
        <div className="flex flex-col items-center lg:flex-row  lg:items-stretch gap-6 h-full">
          {providers.proconnect && (
            <AuthTile
              title="ProConnect"
              provider={providers.proconnect}
              profiles={{ porteurs: true, dreal: false, dgec: false, autres: false }}
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
              className="flex-1"
            />
          )}

          {providers['magic-link'] && (
            <AuthTile
              title="Lien magique"
              provider={providers['magic-link']}
              profiles={{ porteurs: true, dreal: false, dgec: false, autres: false }}
              description="Inscrivez-vous facilement sans mot de passe à l'aide d'un lien magique qui sera envoyé sur votre adresse de courriel"
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
        </div>
      </div>
      <div className="text-right italic mt-2">
        * Autres Partenaires : CRE, Ademe, Caisse des dépôts, Gestionnaire de Réseau, Co-contractant
      </div>
    </PageTemplate>
  );
}

'use client';

import ProConnectButton from '@codegouvfr/react-dsfr/ProConnectButton';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
import Tile from '@codegouvfr/react-dsfr/Tile';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { MagicLinkForm } from '@/components/organisms/auth/MagicLinkForm';
import { ProfilesBadge } from '@/components/organisms/auth/ProfilesBadge';
import { authClient } from '@/auth/client';

type SignUpPageProps = {
  providers: Array<string>;
  callbackUrl: string;
  error?: string;
};

export default function SignUpPage({ providers, callbackUrl, error }: SignUpPageProps) {
  // This checks that the session is up to date with the necessary requirements
  // it's useful when changing what's inside the cookie for instance
  // if (status === 'authenticated' && !data.utilisateur) {
  //   redirect(Routes.Auth.signOut());
  // }
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
          {providers.includes('proconnect') && (
            <Tile
              title="ProConnect"
              desc={
                <div className="flex flex-col flex-wrap">
                  <ProfilesBadge
                    profiles={{
                      'Porteurs de Projet': true,
                      DREAL: false,
                      DGEC: false,
                      'Autres Partenaires*': false,
                    }}
                    title="Profils pouvant s'inscrire avec ProConnect, la solution d'identité de l'État pour les professionnels"
                  />
                  Inscrivez-vous facilement à l'aide de votre adresse professionnelle
                </div>
              }
              detail={
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

          {providers.includes('email') && (
            <Tile
              title="Lien magique"
              desc={
                <div className="flex flex-col ">
                  <ProfilesBadge
                    profiles={{
                      'Porteurs de Projet': true,
                      DREAL: false,
                      DGEC: false,
                      'Autres Partenaires*': false,
                    }}
                    title="Profils pouvant s'inscrire avec un lien de connexion envoyé par email"
                  />
                  Inscrivez-vous facilement sans mot de passe à l'aide d'un lien magique qui sera
                  envoyé sur votre adresse de courriel
                </div>
              }
              detail={
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

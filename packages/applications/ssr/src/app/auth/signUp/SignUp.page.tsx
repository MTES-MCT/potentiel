'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import ProConnectButton from '@codegouvfr/react-dsfr/ProConnectButton';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
import Tile from '@codegouvfr/react-dsfr/Tile';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { MagicLinkForm } from '@/components/organisms/auth/MagicLinkForm';

type SignUpPageProps = {
  providers: Array<string>;
};

export default function SignUpPage({ providers }: SignUpPageProps) {
  const { status, data } = useSession();

  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? Routes.Auth.redirectToDashboard();
  const error = params.get('error');

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
    }
  }, [status, callbackUrl, data]);

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
              desc="Inscrivez-vous facilement à l'aide de votre adresse professionnelle"
              detail={<ProConnectButton onClick={() => signIn('proconnect', { callbackUrl })} />}
              className="flex-1"
            />
          )}

          {providers.includes('email') && (
            <Tile
              title="Lien magique"
              desc="Inscrivez-vous facilement sans mot de passe à l'aide d'un lien magique qui sera envoyé sur votre adresse de courriel"
              detail={<MagicLinkForm callbackUrl={callbackUrl} />}
              className="flex-1"
            />
          )}
        </div>
      </div>
    </PageTemplate>
  );
}

'use client';

import { redirect } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import ProConnectButton from '@codegouvfr/react-dsfr/ProConnectButton';
import Tile from '@codegouvfr/react-dsfr/Tile';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { MagicLinkForm } from '@/components/organisms/auth/MagicLinkForm';
import { ProfilesBadge } from '@/components/organisms/auth/ProfilesBadge';

type SignInPageProps = {
  providers: Array<string>;
  providersKO: Array<string>;
  callbackUrl: string;
  forceProConnect?: boolean;
};

export default function SignInPage({
  providers,
  providersKO,
  callbackUrl,
  forceProConnect,
}: SignInPageProps) {
  const { status, data } = useSession();

  const onlyKeycloak = providers.length === 1 && providers.includes('keycloak');

  useEffect(() => {
    switch (status) {
      case 'authenticated':
        // This checks that the session is up to date with the necessary requirements
        // it's useful when changing what's inside the cookie for instance
        if (!data.utilisateur) {
          redirect(Routes.Auth.signOut());
          break;
        }
        redirect(callbackUrl);
        break;

      case 'unauthenticated':
        if (onlyKeycloak) {
          setTimeout(() => signIn('keycloak', { callbackUrl }), 2000);
        }
        if (forceProConnect) {
          signIn('proconnect', { callbackUrl });
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
            <div className="flex flex-wrap gap-5 justify-center">
              {providers.includes('proconnect') && (
                <Tile
                  title="ProConnect"
                  disabled={providersKO.includes('proconnect')}
                  desc={
                    <div className="flex flex-col">
                      <ProfilesBadge
                        profiles={{
                          'Porteurs de Projet': true,
                          DREAL: true,
                          DGEC: true,
                          'Autres Partenaires*': true,
                        }}
                        title="Profils pouvant se connecter avec ProConnect, la solution d'identité de l'État pour les professionnels"
                      />
                      {providersKO.includes('proconnect') ? (
                        <div>
                          <strong>
                            Le service de connexion par Proconnect est temporairement indisponible.
                          </strong>{' '}
                          Nos équipes travaillent à la résolution de ce problème. Nous vous invitons
                          à utiliser une autre méthode de connexion en attendant.
                        </div>
                      ) : (
                        <div>
                          Connectez-vous facilement à l'aide de votre adresse professionnelle
                        </div>
                      )}
                    </div>
                  }
                  detail={
                    !providersKO.includes('proconnect') && (
                      <ProConnectButton onClick={() => signIn('proconnect', { callbackUrl })} />
                    )
                  }
                  className="flex-1"
                />
              )}

              {providers.includes('email') && (
                <Tile
                  title="Lien magique"
                  disabled={providersKO.includes('email')}
                  desc={
                    <div className="flex flex-col">
                      <ProfilesBadge
                        profiles={{
                          'Porteurs de Projet': true,
                          DREAL: false,
                          DGEC: false,
                          'Autres Partenaires*': true,
                        }}
                        title="Profils pouvant se connecter avec un lien de connexion envoyé par email"
                      />
                      {providersKO.includes('email') ? (
                        <div>
                          <strong>
                            Le service de connexion par lien magique est temporairement
                            indisponible.
                          </strong>{' '}
                          Nos équipes travaillent à la résolution de ce problème. Nous vous invitons
                          à utiliser une autre méthode de connexion en attendant.
                        </div>
                      ) : (
                        <div>
                          Connectez-vous facilement sans mot de passe à l'aide d'un lien magique qui
                          sera envoyé sur votre adresse de courriel
                        </div>
                      )}
                    </div>
                  }
                  detail={
                    !providersKO.includes('email') && <MagicLinkForm callbackUrl={callbackUrl} />
                  }
                  className="flex-1"
                />
              )}

              {providers.includes('keycloak') && (
                <Tile
                  title="Mot de passe"
                  desc={
                    <div className="flex flex-col">
                      <ProfilesBadge
                        profiles={{
                          'Porteurs de Projet': true,
                          DREAL: false,
                          DGEC: false,
                          'Autres Partenaires*': true,
                        }}
                        title="Profils pouvant se connecter avec un mot de passe"
                      />
                      Vous pouvez toujours vous connecter à l'aide de vos identifiants classiques
                    </div>
                  }
                  detail={
                    <Button className="mx-auto" onClick={() => signIn('keycloak', { callbackUrl })}>
                      Connexion avec mot de passe
                    </Button>
                  }
                  className="flex-1 lg:flex-none"
                />
              )}
            </div>
          </div>
          <div className="text-right italic mt-2">
            * Autres Partenaires : CRE, Ademe, Caisse des dépôts, Gestionnaire de Réseau,
            Co-contractant
          </div>
        </>
      )}
    </PageTemplate>
  );
}

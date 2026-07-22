import DsfrHeader from '@codegouvfr/react-dsfr/Header';
import { headers } from 'next/headers';

import type { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { getSessionUser } from '@/auth/getSessionUser';
import { UserBasedRoleNavigation } from './UserBasedRoleNavigation';
import { UserHeaderQuickAccessItem } from './UserHeaderQuickAccessItem';

const getServiceTitle = (utilisateur: PotentielUtilisateur | undefined) => {
  if (!utilisateur?.rôle.estAdmin() || !process.env.APPLICATION_STAGE) {
    return 'Potentiel';
  }

  if (process.env.APPLICATION_STAGE === 'production') {
    return (
      <>
        Potentiel - ⚠️{' '}
        <span className="text-dsfr-text-actionHigh-redMarianne-default">
          {process.env.APPLICATION_STAGE.toUpperCase()}
        </span>{' '}
        ⚠️
      </>
    );
  }

  return (
    <>
      Potentiel -{' '}
      <span className="text-dsfr-text-actionHigh-blueFrance-default">
        {process.env.APPLICATION_STAGE.toUpperCase()}
      </span>
    </>
  );
};

export const Header = async () => {
  const utilisateur = await getSessionUser({ headers: await headers() });

  return (
    <DsfrHeader
      brandTop={
        <>
          République
          <br />
          Française
        </>
      }
      serviceTitle={getServiceTitle(utilisateur)}
      serviceTagline={
        <>
          Facilite le parcours des producteurs
          <br />
          d'énergies renouvelables électriques
        </>
      }
      homeLinkProps={{
        href: '/',
        title: "Retour à l'accueil",
      }}
      quickAccessItems={[
        <UserHeaderQuickAccessItem key={0} />,
        {
          iconId: 'ri-question-line',
          linkProps: {
            target: '_blank',
            href: 'https://docs.potentiel.beta.gouv.fr/guide-dutilisation/sommaire-du-guide-dutilisation',
          },
          text: 'Aide',
        },
      ]}
      navigation={<UserBasedRoleNavigation />}
    />
  );
};

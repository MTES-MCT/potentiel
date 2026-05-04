import DsfrHeader from '@codegouvfr/react-dsfr/Header';

import { UserBasedRoleNavigation } from './UserBasedRoleNavigation';
import { UserHeaderQuickAccessItem } from './UserHeaderQuickAccessItem';

export const Header = () => (
  <DsfrHeader
    brandTop={
      <>
        République
        <br />
        Française
      </>
    }
    serviceTitle="Potentiel"
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
      prefetch: false,
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

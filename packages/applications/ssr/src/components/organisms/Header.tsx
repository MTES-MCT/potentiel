import DsfrHeader from '@codegouvfr/react-dsfr/Header';
import { UserHeaderQuickAccessItem } from '../molecules/UserHeaderQuickAccessItem';
import { UserBasedRoleNavigation } from '../molecules/UserBasedRoleNavigation';
import { Route } from 'next';

export const Header = () => {
  return (
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
        href: '/' as Route,
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

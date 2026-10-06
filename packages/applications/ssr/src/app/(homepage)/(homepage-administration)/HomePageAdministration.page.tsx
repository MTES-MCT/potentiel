import Card from '@codegouvfr/react-dsfr/Card';
import Notice from '@codegouvfr/react-dsfr/Notice';
import Notification from '@codegouvfr/react-dsfr/picto/Notification';

import type { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { Heading1, Heading2 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { DemandesSection } from './Demandes.section';

export type HomePageAdministrationProps = {
  utilisateur: PotentielUtilisateur;
};

export function HomePageAdministration({ utilisateur }: HomePageAdministrationProps) {
  return (
    <PageTemplate banner={<Heading1>Page d'accueil</Heading1>}>
      <div className="flex flex-col gap-6">
        <AlerteNouveauté />
        <Nouveautés />
        <DemandesSection utilisateur={utilisateur} />
      </div>
    </PageTemplate>
  );
}

const AlerteNouveauté = () => (
  <Notice
    title="Votre page d'accueil fait peau neuve"
    severity="info"
    description="Retrouvez y les actualités de Potentiel, un résumé de suivi de vos projets et vos prochaines actions. N'hésitez pas à nous contacter pour nous partager vos retours !"
  />
);

const Nouveautés = () => (
  <div>
    <div className="flex flex-row gap-4 mb-4">
      <Notification color="green-emeraude" fontSize="large" />
      <Heading2>Nouveautés</Heading2>
    </div>
    <div className="flex gap-2">
      <Card
        background
        border
        desc="Retrouvez les 102 candidats lauréats de votre région (Occitanie)"
        size="small"
        linkProps={{
          href: '#',
        }}
        title="L'appel d'offre PPE2 - Sol, période 9, a été notifiée le 11 septembre 2026"
        titleAs="h3"
      />
      <Card
        background
        border
        desc="Retrouvez les enrichis de nouvelles données dans l'onglet Export"
        enlargeLink
        linkProps={{
          href: '#',
        }}
        size="medium"
        title="Les exports de données ont été mis à jour sur Potentiel"
        titleAs="h3"
      />
    </div>
  </div>
);

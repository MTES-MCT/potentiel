import Notice from '@codegouvfr/react-dsfr/Notice';

import type { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { DemandesSection } from './(demandes)/Demandes.section';
import { NouveautésSection } from './(nouveautés)/Nouveautés.section';

export type HomePageAdministrationProps = {
  utilisateur: PotentielUtilisateur;
};
export const HomePageAdministration = ({ utilisateur }: HomePageAdministrationProps) => (
  <PageTemplate
    banner={
      <Heading1>Bienvenue {utilisateur.nom || utilisateur.identifiantUtilisateur.email} !</Heading1>
    }
  >
    <div className="flex flex-col gap-6">
      <AlerteNouveauté utilisateur={utilisateur} />
      <NouveautésSection />
      <DemandesSection />
    </div>
  </PageTemplate>
);

type AlerteNouveautéProps = {
  utilisateur: PotentielUtilisateur;
};
const AlerteNouveauté = ({ utilisateur }: AlerteNouveautéProps) => (
  <Notice
    title="Votre page d'accueil fait peau neuve !"
    severity="info"
    description={`Retrouvez-y les actualités de Potentiel${utilisateur.estDreal() ? ', des indicateurs clés ' : ''} ainsi que vos prochaines actions listées par catégorie. N'hésitez pas à nous contacter pour nous partager vos retours !`}
  />
);

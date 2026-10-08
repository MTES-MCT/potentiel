import Notice from '@codegouvfr/react-dsfr/Notice';

import type { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { DemandesSection } from './Demandes.section';
import { NouveautésSection } from './Nouveautés.sections';

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
      <AlerteNouveauté />
      <NouveautésSection />
      <DemandesSection />
    </div>
  </PageTemplate>
);

const AlerteNouveauté = () => (
  <Notice
    title="Votre page d'accueil fait peau neuve"
    severity="info"
    description="Retrouvez-y les actualités de Potentiel, ainsi que vos prochaines actions listées par catégorie. N'hésitez pas à nous contacter pour nous partager vos retours !"
  />
);

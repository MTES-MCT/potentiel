
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { DemandesSection } from './(demandes)/Demandes.section';
import { NouveautésSection } from './(nouveautés)/Nouveautés.section';
import { PotentielUtilisateur } from '@/auth/utilisateur';

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
      <NouveautésSection />
      <DemandesSection />
    </div>
  </PageTemplate>
);

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '../(components)/SectionPage';

import { ÉvaluationCarboneSimplifiéeSection } from './(sections)/ÉvaluationCarboneSimplifiée.section';
import { FournisseursSection } from './(sections)/Fournisseurs.section';

type ÉvaluationCarbonePageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ÉvaluationCarbonePage = ({ identifiantProjet }: ÉvaluationCarbonePageProps) => (
  <SectionPage title="Évaluation Carbone">
    <div className="flex flex-col gap-4 md:w-1/2">
      <ÉvaluationCarboneSimplifiéeSection identifiantProjet={identifiantProjet} />
      <FournisseursSection identifiantProjet={identifiantProjet} />
    </div>
  </SectionPage>
);

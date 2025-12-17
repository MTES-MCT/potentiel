import { IdentifiantProjet } from '@potentiel-domain/projet';

import { SectionPage } from '../(components)/SectionPage';

import { ÉvaluationCarboneSimplifiéeSection } from './ÉvaluationCarboneSimplifiée.section';
import { FournisseursSection } from './Fournisseurs.section';

type ÉvaluationCarbonePageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ÉvaluationCarbonePage = ({ identifiantProjet }: ÉvaluationCarbonePageProps) => (
  <SectionPage title="Évaluation Carbone">
    <ÉvaluationCarboneSimplifiéeSection identifiantProjet={identifiantProjet} />
    <FournisseursSection identifiantProjet={identifiantProjet} />
  </SectionPage>
);

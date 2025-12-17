import { SectionPage } from '../(components)/SectionPage';

import {
  ÉvaluationCarboneSection,
  ÉvaluationCarboneSectionProps,
} from './ÉvaluationCarbone.section';

export const ÉvaluationCarbonePage = ({ identifiantProjet }: ÉvaluationCarboneSectionProps) => (
  <SectionPage title="Évaluation Carbone">
    <ÉvaluationCarboneSection identifiantProjet={identifiantProjet} />
  </SectionPage>
);

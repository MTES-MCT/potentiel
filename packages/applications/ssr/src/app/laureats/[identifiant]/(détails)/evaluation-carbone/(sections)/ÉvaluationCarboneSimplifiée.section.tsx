import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getFournisseurInfos, SectionWithErrorHandling } from '../../../_helpers';
import { Section } from '../../(components)/Section';

export type ÉvaluationCarboneSimplifiéeSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Évaluation carbone simplifiée';
export const ÉvaluationCarboneSimplifiéeSection = ({
  identifiantProjet,
}: ÉvaluationCarboneSimplifiéeSectionProps) =>
  SectionWithErrorHandling(async () => {
    const { évaluationCarboneSimplifiée } = await getFournisseurInfos(identifiantProjet);

    return (
      <Section title={sectionTitle}>
        <span className="text-nowrap">{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
      </Section>
    );
  }, sectionTitle);

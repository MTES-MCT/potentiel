import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { getFournisseurInfos } from '../../../_helpers';

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

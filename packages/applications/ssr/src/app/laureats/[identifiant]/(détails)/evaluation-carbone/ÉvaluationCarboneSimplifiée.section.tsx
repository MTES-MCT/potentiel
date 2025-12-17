import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getFournisseurInfos } from '../../_helpers';
import { Section } from '../(components)/Section';

export type ÉvaluationCarboneSimplifiéeSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ÉvaluationCarboneSimplifiéeSection = async ({
  identifiantProjet,
}: ÉvaluationCarboneSimplifiéeSectionProps) => {
  const { évaluationCarboneSimplifiée } = await getFournisseurInfos(identifiantProjet);

  return (
    <Section title="Évaluation carbone simplifiée">
      <span className="text-nowrap">{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
    </Section>
  );
};

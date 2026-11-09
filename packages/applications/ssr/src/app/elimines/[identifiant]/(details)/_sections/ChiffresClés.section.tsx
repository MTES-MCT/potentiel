import { notFound } from 'next/navigation';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { ChiffresClésProjet } from '@/components/molecules/projet/ChiffresClésProjet';
import { getÉliminé } from '../../../../_helpers/getÉliminé';

type ChiffresClésSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Chiffres clés';

export const ChiffresClésSection = async ({ identifiantProjet }: ChiffresClésSectionProps) =>
  SectionWithErrorHandling(async () => {
    const éliminé = await getÉliminé(identifiantProjet);

    if (!éliminé) {
      return notFound();
    }

    const { prixReference, evaluationCarboneSimplifiée, puissance, unitéPuissance } = éliminé;

    return (
      <Section title={sectionTitle}>
        <ChiffresClésProjet
          puissance={{
            valeur: puissance,
            unité: unitéPuissance.unité,
          }}
          prixRéférence={prixReference}
          évaluationCarboneSimplifiée={evaluationCarboneSimplifiée}
        />
      </Section>
    );
  }, sectionTitle);

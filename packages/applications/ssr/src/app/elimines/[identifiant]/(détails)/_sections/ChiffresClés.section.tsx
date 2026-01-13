import { notFound } from 'next/navigation';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ChiffresClésProjet } from '@/components/molecules/projet/ChiffresClésProjet';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { Section } from '@/components/atoms/menu/Section';

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

    const {
      prixReference,
      evaluationCarboneSimplifiée,
      puissanceProductionAnnuelle,
      unitéPuissance,
    } = éliminé;

    return (
      <Section title={sectionTitle}>
        <ChiffresClésProjet
          puissance={{
            valeur: puissanceProductionAnnuelle,
            unité: unitéPuissance.unité,
          }}
          prixRéférence={prixReference}
          évaluationCarboneSimplifiée={evaluationCarboneSimplifiée}
        />
      </Section>
    );
  }, sectionTitle);

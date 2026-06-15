import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { ChiffresClésProjet } from '@/components/molecules/projet/ChiffresClésProjet';
import { getLauréat } from '../../_helpers';

type ChiffresClésSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Chiffres clés';

export const ChiffresClésSection = async ({ identifiantProjet }: ChiffresClésSectionProps) =>
  SectionWithErrorHandling(async () => {
    const { puissance, fournisseur, lauréat } = await getLauréat(identifiantProjet);
    return (
      <Section title={sectionTitle}>
        <ChiffresClésProjet
          puissance={{
            valeur: puissance.puissance,
            unité: puissance.unitéPuissance.unité,
          }}
          prixRéférence={lauréat.prixReference}
          évaluationCarboneSimplifiée={fournisseur.évaluationCarboneSimplifiée}
        />
      </Section>
    );
  }, sectionTitle);

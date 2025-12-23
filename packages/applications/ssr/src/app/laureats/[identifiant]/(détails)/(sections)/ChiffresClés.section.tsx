import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ChiffresClésProjet } from '@/components/molecules/projet/ChiffresClésProjet';

import { Section } from '../(components)/Section';
import { getLauréat, SectionWithErrorHandling } from '../../_helpers';

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

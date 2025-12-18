import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ChiffresClésProjet } from '@/components/molecules/projet/ChiffresClésProjet';

import { Section } from '../(components)/Section';
import { getLauréat } from '../../_helpers';

type ChiffresClésSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ChiffresClésSection = async ({ identifiantProjet }: ChiffresClésSectionProps) => {
  const { puissance, fournisseur, lauréat } = await getLauréat(identifiantProjet);
  return (
    <Section title="Chiffres clés">
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
};

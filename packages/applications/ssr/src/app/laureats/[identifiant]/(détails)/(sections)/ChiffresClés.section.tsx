import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/_helpers';
import { Section } from '@/components/atoms/menu/Section';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { ChiffresClésProjet } from '@/components/molecules/projet/ChiffresClésProjet';
import { getFournisseurInfos, getPuissanceInfos } from '../../_helpers';

type ChiffresClésSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Chiffres clés';

export const ChiffresClésSection = async ({ identifiantProjet }: ChiffresClésSectionProps) =>
  SectionWithErrorHandling(async () => {
    const lauréat = await getLauréatInfos(identifiantProjet);
    const puissance = await getPuissanceInfos(identifiantProjet);
    const fournisseur = await getFournisseurInfos(identifiantProjet);

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

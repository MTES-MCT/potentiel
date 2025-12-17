import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { Section } from '../(components)/Section';
import { ListeFournisseurs } from '../../fournisseur/changement/ListeFournisseurs';
import { ChampObligatoireAvecAction } from '../../_helpers';

type Props = {
  évaluationCarboneSimplifiée: ChampObligatoireAvecAction<number>;
  fournisseurs: ChampObligatoireAvecAction<
    PlainType<Array<Lauréat.Fournisseur.Fournisseur.ValueType>>
  >;
};

export const ÉvaluationCarboneDétails = ({ évaluationCarboneSimplifiée, fournisseurs }: Props) => {
  return (
    <>
      <Section title="Évaluation carbone simplifiée">
        <span className="text-nowrap">{évaluationCarboneSimplifiée.value} kg eq CO2/kWc</span>
      </Section>
      <Section title="Fournisseurs">
        {fournisseurs.value.length === 0 ? (
          <span>Champ non renseigné</span>
        ) : (
          <>
            <ListeFournisseurs
              fournisseurs={fournisseurs.value.map((fournisseur) =>
                Lauréat.Fournisseur.Fournisseur.convertirEnValueType({
                  typeFournisseur: fournisseur.typeFournisseur.typeFournisseur,
                  nomDuFabricant: fournisseur.nomDuFabricant,
                  lieuDeFabrication: fournisseur.lieuDeFabrication,
                }),
              )}
            />
            {fournisseurs.action && (
              <TertiaryLink href={fournisseurs.action.url}>
                {fournisseurs.action.label}
              </TertiaryLink>
            )}
          </>
        )}
      </Section>
    </>
  );
};

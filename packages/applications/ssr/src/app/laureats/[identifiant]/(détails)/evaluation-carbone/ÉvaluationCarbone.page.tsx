'use client';

import { Lauréat } from '@potentiel-domain/projet';

import { Section } from '../(components)/Section';
import { SectionPage } from '../(components)/SectionPage';
import { ListeFournisseurs } from '../../fournisseur/changement/ListeFournisseurs';
import { TertiaryLink } from '../../../../../components/atoms/form/TertiaryLink';

import { GetÉvaluationCarboneForProjectPage } from './_helpers/getEvaluationCarboneData';

type Props = { évaluationCarbone: GetÉvaluationCarboneForProjectPage };

export const ÉvaluationCarbonePage = ({ évaluationCarbone }: Props) => (
  <SectionPage title="Évaluation Carbone">
    <ÉvaluationCarbone évaluationCarbone={évaluationCarbone} />
  </SectionPage>
);

const ÉvaluationCarbone = ({ évaluationCarbone }: Props) => {
  const { évaluationCarboneSimplifiée, fournisseurs } = évaluationCarbone;

  return (
    <>
      <Section title="Évaluation carbone simplifiée">
        {évaluationCarboneSimplifiée?.value === undefined ? (
          <span>Champs non renseigné</span>
        ) : (
          <span>{évaluationCarboneSimplifiée.value} kg eq CO2/kWc</span>
        )}
      </Section>
      <Section title="Fournisseurs">
        {!fournisseurs?.value?.length ? (
          <span>Champs non renseigné</span>
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

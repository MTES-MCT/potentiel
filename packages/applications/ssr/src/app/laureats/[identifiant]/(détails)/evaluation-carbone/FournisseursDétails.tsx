import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { ListeFournisseurs } from '../../fournisseur/changement/ListeFournisseurs';
import { ChampObligatoireAvecAction } from '../../_helpers';

type Props = {
  fournisseurs: ChampObligatoireAvecAction<
    PlainType<Array<Lauréat.Fournisseur.Fournisseur.ValueType>>
  >;
};

export const FournisseursDétails = ({ fournisseurs }: Props) => {
  if (fournisseurs.value.length === 0) {
    return <span>Champ non renseigné</span>;
  }
  return (
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
        <TertiaryLink href={fournisseurs.action.url}>{fournisseurs.action.label}</TertiaryLink>
      )}
    </>
  );
};

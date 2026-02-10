import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import * as TypeFournisseur from './typeFournisseur.valueType.js';

export type RawType = {
  typeFournisseur: TypeFournisseur.RawType;
  nomDuFabricant: string;
  lieuDeFabrication: string;
};

export type ValueType = ReadonlyValueType<{
  typeFournisseur: TypeFournisseur.ValueType;
  nomDuFabricant: string;
  lieuDeFabrication: string;
  formatter(): RawType;
}>;

export const bind = ({
  typeFournisseur,
  nomDuFabricant,
  lieuDeFabrication,
}: PlainType<ValueType>): ValueType => {
  return {
    typeFournisseur: TypeFournisseur.bind(typeFournisseur),
    nomDuFabricant,
    lieuDeFabrication,
    estÉgaleÀ(valueType) {
      return (
        this.typeFournisseur.estÉgaleÀ(valueType.typeFournisseur) &&
        this.nomDuFabricant === valueType.nomDuFabricant &&
        this.lieuDeFabrication === valueType.lieuDeFabrication
      );
    },
    formatter() {
      return {
        nomDuFabricant: this.nomDuFabricant,
        lieuDeFabrication: this.lieuDeFabrication,
        typeFournisseur: this.typeFournisseur.formatter(),
      };
    },
  };
};

export const convertirEnValueType = ({
  typeFournisseur,
  nomDuFabricant,
  lieuDeFabrication,
}: {
  typeFournisseur: string;
  nomDuFabricant: string;
  lieuDeFabrication: string;
}): ValueType =>
  bind({
    typeFournisseur: { typeFournisseur: typeFournisseur as TypeFournisseur.RawType },
    nomDuFabricant,
    lieuDeFabrication,
  });

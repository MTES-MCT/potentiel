import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import * as TypeFournisseur from './typeFournisseur.valueType';

export type RawType = {
  typeFournisseur: TypeFournisseur.RawType;
  nomDuFabricant: string;
};

export type ValueType = ReadonlyValueType<{
  typeFournisseur: TypeFournisseur.ValueType;
  nomDuFabricant: string;
  formatter(): RawType;
}>;

export const bind = ({ typeFournisseur, nomDuFabricant }: PlainType<ValueType>): ValueType => {
  return {
    typeFournisseur: TypeFournisseur.bind(typeFournisseur),
    nomDuFabricant,
    estÉgaleÀ(valueType) {
      return (
        this.typeFournisseur === valueType.typeFournisseur &&
        this.nomDuFabricant === valueType.nomDuFabricant
      );
    },
    formatter() {
      return {
        nomDuFabricant: this.nomDuFabricant,
        typeFournisseur: this.typeFournisseur.formatter(),
      };
    },
  };
};

export const convertirEnValueType = ({
  typeFournisseur,
  nomDuFabricant,
}: {
  typeFournisseur: string;
  nomDuFabricant: string;
}): ValueType =>
  bind({
    typeFournisseur: { typeFournisseur: typeFournisseur as TypeFournisseur.RawType },
    nomDuFabricant,
  });

import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type ValueType = ReadonlyValueType<{
  adresse1: string;
  adresse2: string;
  codePostal: string;
  commune: string;
  département: string;
  région: string;
}>;

export const bind = ({
  adresse1,
  adresse2,
  codePostal,
  commune,
  département,
  région,
}: PlainType<ValueType>): ValueType => {
  return {
    adresse1,
    adresse2,
    codePostal,
    commune,
    département,
    région,
    estÉgaleÀ: function ({ adresse1, adresse2, codePostal, commune, département, région }) {
      return (
        this.adresse1 === adresse1 &&
        this.adresse2 === adresse2 &&
        this.codePostal === codePostal &&
        this.commune === commune &&
        this.département === département &&
        this.région === région
      );
    },
  };
};

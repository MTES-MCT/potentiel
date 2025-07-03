import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = {
  adresse1: string;
  adresse2: string;
  codePostal: string;
  commune: string;
  département: string;
  région: string;
};

export type ValueType = ReadonlyValueType<
  RawType & {
    formatter(): RawType;
  }
>;

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
    estÉgaleÀ({ adresse1, adresse2, codePostal, commune, département, région }) {
      return (
        this.adresse1 === adresse1 &&
        this.adresse2 === adresse2 &&
        this.codePostal === codePostal &&
        this.commune === commune &&
        this.département === département &&
        this.région === région
      );
    },
    formatter() {
      return {
        adresse1,
        adresse2,
        codePostal,
        commune,
        département,
        région,
      };
    },
  };
};

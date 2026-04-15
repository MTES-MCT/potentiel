import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { Raccordement } from '../lauréat/index.js';

export type RawType = {
  référence: Raccordement.RéférenceDossierRaccordement.RawType;
  dateQualification: DateTime.RawType;
};

export type ValueType = ReadonlyValueType<{
  référence: Raccordement.RéférenceDossierRaccordement.ValueType;
  dateQualification: DateTime.ValueType;
  formatter(): RawType;
}>;

export const bind = ({ dateQualification, référence }: PlainType<ValueType>): ValueType => {
  return {
    dateQualification: DateTime.convertirEnValueType(dateQualification.date),
    référence: Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référence.référence),
    formatter() {
      return {
        référence: this.référence.formatter(),
        dateQualification: this.dateQualification.formatter(),
      };
    },
    estÉgaleÀ({ dateQualification, référence }: ValueType) {
      return (
        this.dateQualification.estÉgaleÀ(dateQualification) && this.référence.estÉgaleÀ(référence)
      );
    },
  };
};

type ConvertirEnValueTypeProps = {
  dateQualification: string;
  référence: string;
};

export const convertirEnValueType = (props: ConvertirEnValueTypeProps) => {
  return bind({
    référence: { référence: props.référence },
    dateQualification: { date: DateTime.convertirEnValueType(props.dateQualification).formatter() },
  });
};

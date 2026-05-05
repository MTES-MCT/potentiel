import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { applyLuhnCheck } from './utils/applyLuhnCheck.js';

export type RawType = { siret?: string; siren?: string };

export type ValueType = ReadonlyValueType<{
  siret?: string;
  siren?: string;
  formatter: () => RawType;
}>;

export const bind = ({ siret, siren }: PlainType<ValueType>): ValueType => {
  estValide({ siret, siren });
  return {
    siret: siret ? sanitize(siret) : undefined,
    siren: siret ? sanitize(siret).slice(0, 9) : siren ? sanitize(siren) : undefined,
    formatter() {
      return { siret: this.siret, siren: this.siren };
    },
    estÉgaleÀ({ siret, siren }: ValueType) {
      return this.siret === siret && this.siren === siren;
    },
  };
};

const regexSIRET = /^\d{14}$/;
const regexSIREN = /^\d{9}$/;

export const estValideSiret = (value: string): boolean => {
  return regexSIRET.test(value) && applyLuhnCheck(value);
};

export const estValideSiren = (value: string): boolean => {
  return regexSIREN.test(value) && applyLuhnCheck(value);
};

type ConvertirEnValueTypeProps = {
  siren?: string;
  siret?: string;
};

export const convertirEnValueType = (props: ConvertirEnValueTypeProps) => {
  estValide(props);
  return bind(props);
};

function estValide(value: ConvertirEnValueTypeProps): asserts value is RawType {
  if (!value.siret && !value.siren) {
    throw new NuméroIdentificationInvalideError();
  }

  if (value.siret && !estValideSiret(sanitize(value.siret))) {
    throw new SiretInvalideError(value.siret);
  }

  if (value.siren && !estValideSiren(sanitize(value.siren))) {
    throw new SirenInvalideError(value.siren);
  }
}

const sanitize = (value: string) => value.replace(/ /g, '');

class NuméroIdentificationInvalideError extends InvalidOperationError {
  constructor() {
    super(
      `Le numéro d'identification doit comporter au moins un numéro de SIREN ou de SIRET valide`,
    );
  }
}

class SiretInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le numéro de SIRET n'est pas valide`, {
      value,
    });
  }
}

class SirenInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le numéro de SIREN n'est pas valide`, {
      value,
    });
  }
}

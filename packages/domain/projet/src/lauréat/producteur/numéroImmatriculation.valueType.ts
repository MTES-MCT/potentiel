import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

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
  return regexSIRET.test(value.replace(/ /g, ''));
};

export const estValideSiren = (value: string): boolean => {
  return regexSIREN.test(value.replace(/ /g, ''));
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
    throw new NuméroImmatriculationInvalideError();
  }

  if (value.siret && !estValideSiret(value.siret)) {
    throw new SiretInvalideError(value.siret);
  }

  if (value.siren && !estValideSiren(value.siren)) {
    throw new SirenInvalideError(value.siren);
  }
}

const sanitize = (value: string) => value.replace(/ /g, '');

class NuméroImmatriculationInvalideError extends InvalidOperationError {
  constructor() {
    super(
      `Le numéro d'immatriculation doit comporter au moins un numéro de SIREN ou de SIRET valide`,
    );
  }
}

class SiretInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le numéro de SIRET ne correspond pas à un format valide (14 chiffres)`, {
      value,
    });
  }
}

class SirenInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le numéro de SIREN ne correspond pas à un format valide (9 chiffres)`, {
      value,
    });
  }
}

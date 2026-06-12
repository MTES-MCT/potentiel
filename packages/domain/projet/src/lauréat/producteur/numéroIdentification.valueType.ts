import {
  InvalidOperationError,
  type PlainType,
  type ReadonlyValueType,
} from '@potentiel-domain/core';

export type RawType = { siret?: string; siren?: string };

export type ValueType = ReadonlyValueType<{
  siret?: string;
  siren?: string;
  formatter: () => RawType;
  estInconnu(): boolean;
}>;

// L’algorithme de Luhn est une formule simple de somme de contrôle utilisée pour valider des numéros d’identification
export const computeLuhnChecksum = (value: string): number => {
  const digits = value.split('').map(Number).reverse();
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    if (i % 2 !== 0) {
      sum += digit * 2 > 9 ? digit * 2 - 9 : digit * 2;
    } else {
      sum += digit;
    }
  }
  return sum % 10;
};
export const isValidLuhn = (value: string): boolean => computeLuhnChecksum(value) === 0;

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
    estInconnu() {
      return !this.siret && !this.siren;
    },
  };
};

const regexSiret = /^\d{14}$/;
const regexSiren = /^\d{9}$/;

const estValideSiret = (value: string): boolean => {
  if (!regexSiret.test(value)) {
    throw new ChaîneSiretInvalideError(value);
  }

  if (!isValidLuhn(value)) {
    throw new SiretInvalideError(value);
  }

  return true;
};

const estValideSiren = (value: string): boolean => {
  if (!regexSiren.test(value)) {
    throw new ChaîneSirenInvalideError(value);
  }

  if (!isValidLuhn(value)) {
    throw new SirenInvalideError(value);
  }

  return true;
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

const sanitize = (value: string) => value.replace(/\s/g, '');

class NuméroIdentificationInvalideError extends InvalidOperationError {
  constructor() {
    super(
      `Le numéro d'identification doit comporter au moins un numéro de SIREN ou de SIRET valide`,
    );
  }
}

class ChaîneSiretInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le numéro SIRET n'est pas composé de 14 chiffres`, {
      value,
    });
  }
}

class SiretInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le numéro de SIRET n'est pas valide`, {
      value,
    });
  }
}

class ChaîneSirenInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le numéro SIREN n'est pas composé de 9 chiffres`, {
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

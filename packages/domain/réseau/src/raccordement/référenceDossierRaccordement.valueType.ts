import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

const defaultRéférenceDossierRaccordement = 'Référence non transmise';

export type ValueType = ReadonlyValueType<{
  référence: string;
  formatter(): RawType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    référence: value,
    estÉgaleÀ({ référence }) {
      return this.référence === référence;
    },
    formatter() {
      return this.référence;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid =
    value === value.trim().replace(/\s/g, '') || value === defaultRéférenceDossierRaccordement;

  if (!isValid) {
    throw new FormatRéférenceDossierRaccordementInvalideError(value);
  }
}

export const référenceNonTransmise = convertirEnValueType(defaultRéférenceDossierRaccordement);

class FormatRéférenceDossierRaccordementInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(
      `La référence du dossier de raccordement ne doit pas comporter d'espace ou de tabulation extérieur`,
      {
        value,
      },
    );
  }
}

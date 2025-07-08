import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

export type ValueType = ReadonlyValueType<{
  codeEIC: string;
  formatter(): RawType;
  estInconnu(): boolean;
}>;

export const bind = ({ codeEIC }: PlainType<ValueType>): ValueType => {
  estValide(codeEIC);

  return {
    codeEIC,
    formatter() {
      return this.codeEIC;
    },
    estÉgaleÀ(valueType) {
      return valueType.formatter() === this.formatter();
    },
    estInconnu() {
      return this.estÉgaleÀ(inconnu);
    },
  };
};

export const convertirEnValueType = (identifiantGestionnaireRéseau: string): ValueType => {
  return bind({ codeEIC: identifiantGestionnaireRéseau });
};

function estValide(value: string): asserts value is RawType {
  const isValid = !!value;

  if (!isValid) {
    throw new IdentifiantGestionnaireRéseauInvalideError(value);
  }
}

export const inconnu = convertirEnValueType('inconnu');

class IdentifiantGestionnaireRéseauInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'identifiant gestionnaire réseau est invalide`, {
      value,
    });
  }
}

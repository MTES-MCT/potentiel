import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

export type ValueType = ReadonlyValueType<{
  email: string;
  formatter: () => RawType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    email: value,
    formatter() {
      return this.email;
    },
    estÉgaleÀ(valueType) {
      return valueType.email === this.email;
    },
  };
};

const regexEmail = /^[a-zA-Z0-9.+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function estValide(value: string): asserts value is RawType {
  const isValid = regexEmail.test(value) || value === '';

  if (!isValid) {
    throw new EmailInvalideError(value);
  }
}

export const defaultValue = convertirEnValueType('');

class EmailInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'email du gestionnaire réseau ne correspond pas à un format valide`, {
      value,
    });
  }
}

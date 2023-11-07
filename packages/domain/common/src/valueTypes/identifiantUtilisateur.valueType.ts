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
  const isValid = regexEmail.test(value);

  if (!isValid) {
    throw new EmailInvalideError(value);
  }
}

class EmailInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'email ne correspond pas à un format valide`, {
      value,
    });
  }
}

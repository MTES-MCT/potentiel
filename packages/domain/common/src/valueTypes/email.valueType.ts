import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

export type ValueType = ReadonlyValueType<{
  email: string;
  formatter: () => RawType;
}>;

export const bind = ({ email }: PlainType<ValueType>): ValueType => {
  estValide(email);
  return {
    email,
    formatter() {
      return this.email;
    },
    estÉgaleÀ(valueType) {
      return valueType.email === this.email;
    },
  };
};

export const convertirEnValueType = (value: string): ValueType => {
  return bind({
    email: value,
  });
};

const regexEmail = /^[a-zA-Z0-9.+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const system = () => convertirEnValueType('system@system');

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

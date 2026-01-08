import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

export type ValueType = ReadonlyValueType<{
  email: string;
  formatter: () => RawType;
  estInconnu: () => boolean;
  estSystème: () => boolean;
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
    estInconnu() {
      return this.estÉgaleÀ(inconnu);
    },
    estSystème() {
      return this.estÉgaleÀ(système);
    },
  };
};

export const convertirEnValueType = (value: string): ValueType => {
  return bind({
    email: value.toLowerCase(),
  });
};

const regexEmail = /^[a-z0-9.+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;

export const système = convertirEnValueType('system@system');
export const inconnu = convertirEnValueType('unknown-user@unknown-email.com');

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

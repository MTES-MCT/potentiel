import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = string;

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  email: Type;
  formatter: () => Type;
  estInconnu: () => boolean;
  estSystème: () => boolean;
}>;

export const bind = <Type extends RawType = RawType>({
  email,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(email);
  return {
    get email() {
      return email as Type;
    },
    formatter() {
      return this.email;
    },
    estÉgaleÀ(valueType) {
      return valueType.email === this.email;
    },
    estInconnu() {
      return convertirEnValueType(this.email).estÉgaleÀ(inconnu);
    },
    estSystème() {
      return convertirEnValueType(this.email).estÉgaleÀ(système);
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(email: string): ValueType => {
  estValide(email);
  return bind<Type>({
    email: email.toLowerCase(),
  });
};

const regexEmail = /^[a-z0-9.+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;

export const système = convertirEnValueType<'système'>('system@system');
export const inconnu = convertirEnValueType<'inconnu'>('unknown-user@unknown-email.com');

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

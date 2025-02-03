import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

/**
 * @deprecated Use potentiel-domain/common Email ValueType instead
 */
export type RawType = string;

/**
 * @deprecated Use potentiel-domain/common Email ValueType instead
 */
export type ValueType = ReadonlyValueType<{
  email: string;
  formatter: () => RawType;
}>;

/**
 * @deprecated Use potentiel-domain/common Email ValueType instead
 */
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

/**
 * @deprecated Use potentiel-domain/common Email ValueType instead
 */
export const convertirEnValueType = (value: string): ValueType => {
  return bind({
    email: value.toLowerCase(),
  });
};

/**
 * @deprecated Use potentiel-domain/common Email ValueType instead
 */
const regexEmail = /^[a-z0-9.+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;

/**
 * @deprecated Use potentiel-domain/common Email ValueType instead
 */
function estValide(value: string): asserts value is RawType {
  const isValid = regexEmail.test(value);

  if (!isValid) {
    throw new EmailInvalideError(value);
  }
}

export const unknownUser = convertirEnValueType('unknown-user@unknown-email.com');

/**
 * @deprecated Use potentiel-domain/common Email ValueType instead
 */
class EmailInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'email ne correspond pas à un format valide`, {
      value,
    });
  }
}

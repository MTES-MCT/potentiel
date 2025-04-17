import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

const emails = [
  'aoeolien@developpement-durable.gouv.fr',
  'aopv.dgec@developpement-durable.gouv.fr',
] as const;
export type RawType = (typeof emails)[number];
export type ValueType = ReadonlyValueType<{
  email: RawType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get email() {
      return value;
    },
    estÉgaleÀ(valueType: ValueType) {
      return this.email === valueType.email;
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = emails.includes(value as RawType);

  if (!isValid) {
    throw new EmailDGECInvalideError(value);
  }
}

export const EmailDgecAoPv = convertirEnValueType('aopv.dgec@developpement-durable.gouv.fr');
export const EmailDgecAoEolien = convertirEnValueType('aoeolien@developpement-durable.gouv.fr');

class EmailDGECInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`L'email ne correspond pas à un email de la DGEC`, {
      value,
    });
  }
}

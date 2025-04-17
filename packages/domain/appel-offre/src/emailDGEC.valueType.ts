import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType =
  | 'aopv.dgec@developpement-durable.gouv.fr'
  | 'aoeolien@developpement-durable.gouv.fr';

const emails: Array<RawType> = [
  'aoeolien@developpement-durable.gouv.fr',
  'aopv.dgec@developpement-durable.gouv.fr',
];
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
  const isValid = (emails as Array<string>).includes(value);

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

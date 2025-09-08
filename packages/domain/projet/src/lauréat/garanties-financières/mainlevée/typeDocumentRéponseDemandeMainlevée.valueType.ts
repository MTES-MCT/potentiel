import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument = 'accord-demande-mainlevee' | 'rejet-demande-mainlevee';

export type RawType = `demande-mainlevee/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = ['accord-demande-mainlevee', 'rejet-demande-mainlevee'];

export type ValueType = Readonly<{
  type: TypeDocument;
  formatter(): RawType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    type: value,
    formatter() {
      return `demande-mainlevee/${this.type}`;
    },
  };
};

export const courrierRéponseMainlevéeAccordéeValueType = convertirEnValueType(
  'accord-demande-mainlevee',
);

export const courrierRéponseMainlevéeRejetéeValueType =
  convertirEnValueType('rejet-demande-mainlevee');

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeRéponseInvalideError(value);
  }
}

class TypeRéponseInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

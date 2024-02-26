import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument =
  | 'attestation-garanties-financieres-soumises'
  | 'attestation-garanties-financieres';

export type RawType = `garanties-financieres/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = [
  'attestation-garanties-financieres-soumises',
  'attestation-garanties-financieres',
];

export type ValueType = Readonly<{
  type: TypeDocument;
  formatter(): RawType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    type: value,
    formatter() {
      return `garanties-financieres/${this.type}`;
    },
  };
};

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentGarantiesFinancièresInvalideError(value);
  }
}

export const garantiesFinancièresÀTraiter = convertirEnValueType(
  'attestation-garanties-financieres-soumises',
);

class TypeDocumentGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument = 'attestation-conformite' | 'preuve-transmission-attestation-conformite';

export type RawType = `achevement/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = [
  'attestation-conformite',
  'preuve-transmission-attestation-conformite',
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
      return `achevement/${this.type}`;
    },
  };
};

export const attestationConformitéValueType = convertirEnValueType('attestation-conformite');

export const attestationConformitéPreuveTransmissionValueType = convertirEnValueType(
  'preuve-transmission-attestation-conformite',
);

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentAttestationConformitéInvalideError(value);
  }
}

class TypeDocumentAttestationConformitéInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

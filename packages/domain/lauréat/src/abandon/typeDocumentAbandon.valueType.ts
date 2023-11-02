import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument =
  | 'abandon-accordé'
  | 'pièce-justificative'
  | 'abandon-à-confirmer'
  | 'abandon-rejeté';

export type RawType = `abandon/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = [
  'abandon-accordé',
  'pièce-justificative',
  'abandon-à-confirmer',
  'abandon-rejeté',
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
      return `abandon/${this.type}`;
    },
  };
};

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentAbandonInvalideError(value);
  }
}

export const abandonAccordé = convertirEnValueType('abandon-accordé');
export const pièceJustificative = convertirEnValueType('pièce-justificative');
export const abandonÀConfirmer = convertirEnValueType('abandon-à-confirmer');
export const abandonRejeté = convertirEnValueType('abandon-rejeté');

class TypeDocumentAbandonInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument = 'changement-accordé' | 'pièce-justificative' | 'changement-rejeté';

export type RawType = `actionnaire/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = [
  'changement-accordé',
  'pièce-justificative',
  'changement-rejeté',
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
      return `actionnaire/${this.type}`;
    },
  };
};

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentActionnaireInvalideError(value);
  }
}

export const modificationAccordée = convertirEnValueType('changement-accordé');
export const pièceJustificative = convertirEnValueType('pièce-justificative');
export const modificationRejetée = convertirEnValueType('changement-rejeté');

class TypeDocumentActionnaireInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

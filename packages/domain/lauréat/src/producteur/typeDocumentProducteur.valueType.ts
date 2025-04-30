import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument = 'pièce-justificative';

export type RawType = `producteur/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = ['pièce-justificative'];

export type ValueType = Readonly<{
  type: TypeDocument;
  formatter(): RawType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    type: value,
    formatter() {
      return `producteur/${this.type}`;
    },
  };
};

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentPuissanceInvalideError(value);
  }
}

export const pièceJustificative = convertirEnValueType('pièce-justificative');

class TypeDocumentPuissanceInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

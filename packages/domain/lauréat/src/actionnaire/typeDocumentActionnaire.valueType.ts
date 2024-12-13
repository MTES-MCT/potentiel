import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument = 'modification-accordée' | 'pièce-justificative' | 'modification-rejetée';

export type RawType = `modification-actionnaire/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = [
  'modification-accordée',
  'pièce-justificative',
  'modification-rejetée',
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
      return `modification-actionnaire/${this.type}`;
    },
  };
};

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentActionnaireInvalideError(value);
  }
}

export const modificationAccordée = convertirEnValueType('modification-accordée');
export const pièceJustificative = convertirEnValueType('pièce-justificative');
export const modificationRejetée = convertirEnValueType('modification-rejetée');

class TypeDocumentActionnaireInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument = 'pièce-justificative';

export type RawType = `typologie-installation/${TypeDocument}`;

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
      return `typologie-installation/${this.type}`;
    },
  };
};

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentTypologieInstallationInvalideError(value);
  }
}

export const pièceJustificative = convertirEnValueType('pièce-justificative');

class TypeDocumentTypologieInstallationInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

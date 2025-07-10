import { InvalidOperationError } from '@potentiel-domain/core';

const typeDocument = ['pièce-justificative', 'demande-accordée', 'demande-rejetée'] as const;
type TypeDocument = (typeof typeDocument)[number];

export type RawType = `délai/${TypeDocument}`;

export type ValueType = Readonly<{
  type: TypeDocument;
  formatter(): RawType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    type: value,
    formatter() {
      return `délai/${this.type}`;
    },
  };
};

function estValide(value: string): asserts value is TypeDocument {
  const isValid = typeDocument.includes(value as TypeDocument);

  if (!isValid) {
    throw new TypeDocumentDélaiInvalideError(value);
  }
}

export const pièceJustificative = convertirEnValueType('pièce-justificative');
export const demandeAccordée = convertirEnValueType('demande-accordée');
export const demandeRejetée = convertirEnValueType('demande-rejetée');

class TypeDocumentDélaiInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

import { InvalidOperationError } from '@potentiel-domain/core';

const typeDocument = ['pièce-justificative', 'demande-accordée', 'demande-rejetée'] as const;
type TypeDocument = (typeof typeDocument)[number];

export type RawType = `délai/${TypeDocument}`;

export type ValueType = Readonly<{
  type: TypeDocument;
  formatter(): RawType;
}>;

export const convertirEnValueType = <T extends TypeDocument = TypeDocument>(
  value: string,
): ValueType => {
  estValide(value);
  return {
    type: value as T,
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

export const pièceJustificative =
  convertirEnValueType<'pièce-justificative'>('pièce-justificative');
export const demandeAccordée = convertirEnValueType<'demande-accordée'>('demande-accordée');
export const demandeRejetée = convertirEnValueType<'demande-rejetée'>('demande-rejetée');

class TypeDocumentDélaiInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

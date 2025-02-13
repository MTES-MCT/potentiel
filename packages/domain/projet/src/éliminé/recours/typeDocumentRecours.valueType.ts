import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument = 'recours-accordé' | 'pièce-justificative' | 'recours-rejeté';

export type RawType = `recours/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = [
  'recours-accordé',
  'pièce-justificative',
  'recours-rejeté',
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
      return `recours/${this.type}`;
    },
  };
};

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentRecoursInvalideError(value);
  }
}

export const recoursAccordé = convertirEnValueType('recours-accordé');
export const pièceJustificative = convertirEnValueType('pièce-justificative');
export const recoursRejeté = convertirEnValueType('recours-rejeté');

class TypeDocumentRecoursInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

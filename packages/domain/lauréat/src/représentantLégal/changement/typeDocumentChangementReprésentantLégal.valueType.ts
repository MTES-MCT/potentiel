import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument = 'pièce-justificative' | 'changement-accordé';

export type RawType = `représentant-légal/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = ['pièce-justificative', 'changement-accordé'];

export type ValueType = Readonly<{
  type: TypeDocument;
  formatter(): RawType;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    type: value,
    formatter() {
      return `représentant-légal/${this.type}`;
    },
  };
};

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentChangementReprésentantLégalInvalideError(value);
  }
}

export const pièceJustificative = convertirEnValueType('pièce-justificative');
export const changementAccordé = convertirEnValueType('changement-accordé');

class TypeDocumentChangementReprésentantLégalInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

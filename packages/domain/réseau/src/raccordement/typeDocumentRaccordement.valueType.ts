import { InvalidOperationError } from '@potentiel-domain/core';

export type TypeDocument = 'accusé-réception' | 'proposition-technique-et-financière';

type Référence = string;

export type RawType = `raccordement/${Référence}/${TypeDocument}`;

const typeDocument: Array<TypeDocument> = [
  'accusé-réception',
  'proposition-technique-et-financière',
];

export type ValueType = Readonly<{
  type: TypeDocument;
  référence: string;
  formatter(): RawType;
}>;

export const getFormattedRéférence = (référence: string) => référence.replace(/[/:*?"<>|]/g, '_');

export const convertirEnValueType =
  (typeValue: string) =>
  (référenceValue: string): ValueType => {
    estValide(typeValue);
    return {
      type: typeValue,
      référence: référenceValue,
      formatter() {
        return `raccordement/${getFormattedRéférence(référenceValue)}/${this.type}`;
      },
    };
  };

export const convertirEnAccuséRéceptionValueType = convertirEnValueType('accusé-réception');
export const convertirEnPropositionTechniqueEtFinancièreValueType = convertirEnValueType(
  'proposition-technique-et-financière',
);

function estValide(value: string): asserts value is TypeDocument {
  const isValid = (typeDocument as Array<string>).includes(value);

  if (!isValid) {
    throw new TypeDocumentAbandonInvalideError(value);
  }
}

class TypeDocumentAbandonInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

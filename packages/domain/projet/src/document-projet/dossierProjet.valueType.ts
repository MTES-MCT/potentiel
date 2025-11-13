import { join } from 'path';

import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

import { IdentifiantProjet } from '..';

type TypeDocument = string;
export type RawType = `${IdentifiantProjet.RawType}/${TypeDocument}`;

export type ValueType = ReadonlyValueType<{
  formatter(): RawType;
}>;

export const convertirEnValueType = (
  identifiantProjetValue: string,
  typeDocumentValue: string,
): ValueType => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

  estUnTypeDeDocumentValide(typeDocumentValue);

  return {
    formatter() {
      return join(identifiantProjet.formatter(), typeDocumentValue) as RawType;
    },
    estÉgaleÀ(valueType: ValueType) {
      return this.formatter() === valueType.formatter();
    },
  };
};

const nomRépertoireRegex = /^[^?*:;{}\\]+$/;

const estUnTypeDeDocumentValide = (value: string) => {
  const isValid = nomRépertoireRegex.test(value);

  if (!isValid) {
    throw new TypeDocumentInvalideError(value);
  }
};

class TypeDocumentInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document n'est pas valide`, {
      value,
    });
  }
}

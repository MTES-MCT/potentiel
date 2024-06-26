import { join } from 'path';

import { InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

type TypeDocument = string;
export type RawType = `${IdentifiantProjet.RawType}/${TypeDocument}`;

export type ValueType = Readonly<{
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

import { join } from 'path';

import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../index.js';

type TypeDocument = string;
export type RawType = `${IdentifiantProjet.RawType}/${TypeDocument}`;

export type ValueType = ReadonlyValueType<{
  formatter(): RawType;
}>;

type Payload = {
  identifiantProjet: string;
  typeDocument: string;
  cléDocument?: string;
};

export const convertirEnValueType = ({
  identifiantProjet: identifiantProjetValue,
  typeDocument: typeDocumentValue,
  cléDocument: cléDocumentValue,
}: Payload): ValueType => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

  estValide(typeDocumentValue);
  if (cléDocumentValue) {
    estValide(cléDocumentValue);
  }

  return {
    formatter() {
      const parts: string[] = [identifiantProjet.formatter()];

      if (cléDocumentValue) {
        parts.push(cléDocumentValue);
      }
      parts.push(typeDocumentValue);
      return join(...parts) as RawType;
    },
    estÉgaleÀ(valueType: ValueType) {
      return this.formatter() === valueType.formatter();
    },
  };
};

const nomRépertoireRegex = /^[^?*:;{}\\]+$/;

const estValide = (value: string) => {
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

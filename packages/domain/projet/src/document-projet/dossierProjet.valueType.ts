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
};

export const convertirEnValueType = ({
  identifiantProjet: identifiantProjetValue,
  typeDocument: typeDocumentValue,
}: Payload): ValueType => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

  estValide(typeDocumentValue);

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

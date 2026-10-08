import { join } from 'node:path';

import { InvalidOperationError, type ReadonlyValueType } from '@potentiel-domain/core';

import * as IdentifiantProjet from '../identifiantProjet.valueType.js';

type TypeDocument = string;
export type RawType = `${IdentifiantProjet.RawType}/${TypeDocument}`;

export type ValueType = ReadonlyValueType<{
  formatter(): RawType;
}>;

type Payload = {
  identifiantProjet: string;
  typeDocument: string;
};

// vérification de caractères interdits dans les URLs (' ? * : ; { })
export const contientCaractèresInterdits = (value: string) => /['?*:;{}\\]/.test(value);

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

const estValide = (value: string) => {
  const isValid = value;
  // TODO: ajouter cela en hotfix une fois que le script aura tourné
  // && !contientCaractèresInterdits(value);

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

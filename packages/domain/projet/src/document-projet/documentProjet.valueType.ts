import { join } from 'path';

import { extension } from 'mime-types';

import { InvalidOperationError, PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../index.js';

import { DossierProjet } from './index.js';

type Extension = string;
export type RawType = `${DossierProjet.RawType}/${DateTime.RawType}.${Extension}` | ``;

export type ValueType = Readonly<{
  identifiantProjet: string;
  typeDocument: string;
  dateCréation: string;
  format: string;
  formatter(): RawType;
}>;

export const bind = ({
  dateCréation,
  format,
  identifiantProjet,
  typeDocument,
}: PlainType<ValueType>): ValueType => {
  const extensionFichier = extension(format);
  estUneExtensionFichierValide(extensionFichier);
  estUnTypeDeDocumentValide(typeDocument);

  return {
    format,
    dateCréation: DateTime.convertirEnValueType(dateCréation).formatter(),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
    typeDocument,
    formatter() {
      /**
       * @todo Ici le valueType ne devrait pas savoir que l'enregistrement du document doit se faire dans un file system qui demande de créer un chemin de fichier (à l'aide du join)
       * cf upload.ts
       */
      return join(
        identifiantProjet,
        typeDocument,
        `${dateCréation}.${extensionFichier}`,
      ) as RawType;
    },
  };
};

export const convertirEnValueType = (
  identifiantProjet: string,
  typeDocument: string,
  dateCréation: string,
  format: string,
): ValueType => {
  return bind({
    identifiantProjet,
    typeDocument,
    dateCréation,
    format,
  });
};

function estUneExtensionFichierValide(value: string | false): asserts value is string {
  if (!value) {
    throw new FormatDocumentInvalideError();
  }
}

const nomRépertoireRegex = /^[^?*:;{}\\]+$/;

const estUnTypeDeDocumentValide = (value: string) => {
  const isValid = nomRépertoireRegex.test(value);

  if (!isValid) {
    throw new TypeDocumentInvalideError(value);
  }
};

class FormatDocumentInvalideError extends InvalidOperationError {
  constructor() {
    super(`Le format est invalide`);
  }
}

class TypeDocumentInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type du document n'est pas valide`, {
      value,
    });
  }
}

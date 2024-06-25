import { join } from 'path';

import { extension } from 'mime-types';

import { InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

export type RawType = `${IdentifiantProjet.RawType}/${string}/${DateTime.RawType}.${string}`;

export type ValueType = Readonly<{
  format: string;
  formatter(): RawType;
}>;

export const convertirEnValueType = (
  identifiantProjetValue: string,
  typeDocumentValue: string,
  dateCréationValue: string,
  formatValue: string,
): ValueType => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
  const dateCréation = DateTime.convertirEnValueType(dateCréationValue);

  const extensionFichier = extension(formatValue);
  estUneExtensionFichierValide(extensionFichier);
  estUnTypeDeDocumentValide(typeDocumentValue);

  return {
    format: formatValue,
    formatter() {
      /**
       * @todo Ici le valueType ne devrait pas savoir que l'enregistrement du document doit se faire dans un file system qui demande de créer un chemin de fichier (à l'aide du join)
       * cf upload.ts
       */
      return join(
        identifiantProjet.formatter(),
        typeDocumentValue,
        `${dateCréation.formatter()}.${extensionFichier}`,
      ) as RawType;
    },
  };
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

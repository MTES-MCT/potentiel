import * as IdentifiantProjet from '../valueTypes/identifiantProjet.valueType';
import * as DateTime from '../valueTypes/dateTime.valueType';
import { join } from 'path';
import { extension } from 'mime-types';
import { InvalidOperationError } from '@potentiel-domain/core';

export type RawType = `${IdentifiantProjet.RawType}/${string}/${DateTime.RawType}.${string}`;

export type ValueType = Readonly<{
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

  const format = extension(formatValue);
  estUnFormatValide(format);
  estUnTypeDeDocumentValide(typeDocumentValue);

  return {
    formatter() {
      return join(
        identifiantProjet.formatter(),
        typeDocumentValue,
        `${dateCréation.formatter()}.${format}`,
      ) as RawType;
    },
  };
};

function estUnFormatValide(value: string | false): asserts value is string {
  if (!value) {
    throw new FormatDocumentInvalideError();
  }
}

const nomRépertoireRegex = /^[^/?*:;{}\\]+$/;

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

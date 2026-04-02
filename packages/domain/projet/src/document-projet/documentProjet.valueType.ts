import { join } from 'path';

import { extension } from 'mime-types';

import { InvalidOperationError, PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import * as IdentifiantProjet from '../identifiantProjet.valueType.js';

import { DossierProjet } from './index.js';

type Extension = string;
export type RawType = `${DossierProjet.RawType}/${DateTime.RawType}.${Extension}` | ``;

export type ValueType = Readonly<{
  identifiantProjet: string;
  typeDocument: string;
  cléDocument?: string;
  dateCréation: string;
  format: string;
  formatter(): RawType;
}>;

export const bind = ({
  dateCréation,
  format,
  identifiantProjet,
  cléDocument,
  typeDocument,
}: PlainType<ValueType>): ValueType => {
  const extensionFichier = extension(format);
  estUneExtensionFichierValide(extensionFichier);

  const dossierProjet = DossierProjet.convertirEnValueType({
    identifiantProjet,
    typeDocument,
    cléDocument,
  });

  return {
    format,
    dateCréation: DateTime.convertirEnValueType(dateCréation).formatter(),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
    typeDocument,
    cléDocument,
    formatter() {
      /**
       * @todo Ici le valueType ne devrait pas savoir que l'enregistrement du document doit se faire dans un file system qui demande de créer un chemin de fichier (à l'aide du join)
       * cf upload.ts
       */
      return join(dossierProjet.formatter(), `${dateCréation}.${extensionFichier}`) as RawType;
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

class FormatDocumentInvalideError extends InvalidOperationError {
  constructor() {
    super(`Le format est invalide`);
  }
}

type DynamicField<TNomChamp extends string, TType> = {
  [PDocument in TNomChamp]: TType;
};

export const documentFactory =
  <
    TNomChampDocument extends string,
    TNomChampDate extends string,
    TNomCléDocument extends string | undefined,
  >({
    domaine,
    nomChampDate,
    nomChampDocument,
    typeDocument,
    nomCléDocument,
  }: {
    domaine: string;
    typeDocument: string;
    nomChampDocument: TNomChampDocument;
    nomChampDate: TNomChampDate;
    nomCléDocument?: TNomCléDocument;
  }) =>
  (
    payload: DynamicField<'identifiantProjet', string> &
      DynamicField<TNomChampDate, string> &
      Partial<DynamicField<TNomChampDocument, { format: string }>> &
      (TNomCléDocument extends string ? DynamicField<TNomCléDocument, string> : unknown),
  ) =>
    payload[nomChampDocument] &&
    bind({
      identifiantProjet: payload.identifiantProjet,
      typeDocument: domaine ? `${domaine}/${typeDocument}` : typeDocument,
      cléDocument: nomCléDocument ? payload[nomCléDocument as keyof typeof payload] : undefined,
      dateCréation: payload[nomChampDate],
      format: payload[nomChampDocument].format,
    });

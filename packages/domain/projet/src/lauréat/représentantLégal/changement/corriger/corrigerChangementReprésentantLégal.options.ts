import { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import { TypeReprésentantLégal } from '../..';

export type CorrigerChangementOptions = {
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateCorrection: DateTime.ValueType;
};

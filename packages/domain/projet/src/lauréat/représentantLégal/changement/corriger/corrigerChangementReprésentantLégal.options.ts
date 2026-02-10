import { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '../../../../document-projet/index.js';
import { TypeReprésentantLégal } from '../../index.js';

export type CorrigerChangementOptions = {
  nomReprésentantLégal: string;
  typeReprésentantLégal: TypeReprésentantLégal.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateCorrection: DateTime.ValueType;
};

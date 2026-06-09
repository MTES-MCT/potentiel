import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import type { NuméroIdentification } from '../../index.js';

export type CorrigerNuméroIdentificationOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  numéroIdentification: NuméroIdentification.ValueType;
  raison?: string;
};

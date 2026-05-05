import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { NuméroIdentification } from '../index.js';

export type ImporterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateImport: DateTime.ValueType;
  numéroIdentification?: NuméroIdentification.ValueType;
};

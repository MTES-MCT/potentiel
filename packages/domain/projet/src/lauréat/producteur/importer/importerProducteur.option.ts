import type { DateTime, Email } from '@potentiel-domain/common';

import type { IdentifiantProjet } from '../../../index.js';
import type { NuméroIdentification } from '../index.js';

export type ImporterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateImport: DateTime.ValueType;
  numéroIdentification?: NuméroIdentification.ValueType;
};

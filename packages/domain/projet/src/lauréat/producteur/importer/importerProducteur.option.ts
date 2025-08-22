import type { DateTime, Email } from '@potentiel-domain/common';

import type { IdentifiantProjet } from '../../..';

export type ImporterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateImport: DateTime.ValueType;
};

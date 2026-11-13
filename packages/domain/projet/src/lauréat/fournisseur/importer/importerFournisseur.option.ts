import type { DateTime, Email } from '@potentiel-domain/common';

import type { Fournisseur } from '../index.js';

export type ImporterOptions = {
  identifiantUtilisateur: Email.ValueType;
  évaluationCarboneSimplifiée: number;
  fournisseurs: Array<Fournisseur.ValueType>;
  importéLe: DateTime.ValueType;
};

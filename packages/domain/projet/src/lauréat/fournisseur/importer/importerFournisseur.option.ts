import type { DateTime, Email } from '@potentiel-domain/common';

import type { Fournisseur } from '..';

export type ImporterOptions = {
  identifiantUtilisateur: Email.ValueType;
  évaluationCarboneSimplifiée: number;
  fournisseurs: Array<Fournisseur.ValueType>;
  importéLe: DateTime.ValueType;
};

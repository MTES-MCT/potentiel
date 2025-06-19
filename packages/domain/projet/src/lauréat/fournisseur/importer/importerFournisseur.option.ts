import { DateTime, Email } from '@potentiel-domain/common';

import { Fournisseur } from '..';

export type ImporterOptions = {
  identifiantUtilisateur: Email.ValueType;
  évaluationCarboneSimplifiée: number;
  fournisseurs: Array<Fournisseur.ValueType>;
  importéLe: DateTime.ValueType;
};

import { DateTime, Email } from '@potentiel-domain/common';

import { TypeFournisseur } from '..';

export type ImporterOptions = {
  identifiantUtilisateur: Email.ValueType;
  évaluationCarboneSimplifiée: number;
  fournisseurs: Array<{
    typeFournisseur: TypeFournisseur.ValueType;
    nomDuFabricant: string;
  }>;
  importéLe: DateTime.ValueType;
};

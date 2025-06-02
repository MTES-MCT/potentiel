import { DateTime, Email } from '@potentiel-domain/common';

import { ChampsFournisseurDétails } from '../types';

export type ImporterOptions = {
  identifiantUtilisateur: Email.ValueType;
  évaluationCarboneSimplifiée: number;
  details: ChampsFournisseurDétails;
  importéLe: DateTime.ValueType;
};

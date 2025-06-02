import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';
import { ChampsFournisseurDétails } from '../types';

export type ImporterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  évaluationCarboneSimplifiée: number;
  details: ChampsFournisseurDétails;
  dateImport: DateTime.ValueType;
};

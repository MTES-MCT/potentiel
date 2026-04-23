import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

import { NuméroImmatriculation } from '../index.js';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateModification: DateTime.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
  numéroImmatriculation?: NuméroImmatriculation.ValueType;
};

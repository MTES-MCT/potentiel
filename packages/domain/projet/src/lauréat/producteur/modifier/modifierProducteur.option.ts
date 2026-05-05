import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

import { NuméroIdentification } from '../index.js';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateModification: DateTime.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
  numéroIdentification?: NuméroIdentification.ValueType;
};

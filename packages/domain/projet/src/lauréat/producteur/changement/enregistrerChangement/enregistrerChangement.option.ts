import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import type { NuméroIdentification } from '../../index.js';

export type EnregistrerChangementProducteurOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  numéroIdentification?: NuméroIdentification.ValueType;
  raison?: string;
};

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

export type EnregistrerChangementOptions = {
  identifiantUtilisateur: Email.ValueType;
  puissance: number;
  puissanceDeSite?: number;
  dateChangement: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison?: string;
};

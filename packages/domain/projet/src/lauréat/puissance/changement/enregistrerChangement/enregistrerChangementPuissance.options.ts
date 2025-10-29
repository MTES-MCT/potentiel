import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

export type EnregistrerChangementOptions = {
  identifiantUtilisateur: Email.ValueType;
  puissance: number;
  puissanceDeSite?: number;
  dateChangement: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison?: string;
};

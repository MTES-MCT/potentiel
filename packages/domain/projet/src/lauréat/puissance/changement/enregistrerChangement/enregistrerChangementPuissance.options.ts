import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

export type EnregistrerChangementOptions = {
  identifiantUtilisateur: Email.ValueType;
  nouvellePuissance: number;
  dateChangement: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison?: string;
};

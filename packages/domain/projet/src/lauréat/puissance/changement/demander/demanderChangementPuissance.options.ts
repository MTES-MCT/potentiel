import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../..';

export type DemanderOptions = {
  puissance: number;
  puissanceDeSite?: number;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
};

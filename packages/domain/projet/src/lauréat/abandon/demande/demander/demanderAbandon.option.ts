import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};

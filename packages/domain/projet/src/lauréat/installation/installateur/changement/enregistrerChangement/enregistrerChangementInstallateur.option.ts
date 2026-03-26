import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

export type EnregistrerChangementInstallateurOptions = {
  identifiantUtilisateur: Email.ValueType;
  installateur: string;
  dateChangement: DateTime.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};

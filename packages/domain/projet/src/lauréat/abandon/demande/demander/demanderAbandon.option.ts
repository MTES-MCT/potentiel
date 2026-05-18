import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
  PPASignalé?: true;
};

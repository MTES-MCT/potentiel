import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};

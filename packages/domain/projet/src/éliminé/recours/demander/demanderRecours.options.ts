import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../..';

export type DemanderOptions = {
  dateDemande: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  pièceJustificative: DocumentProjet.ValueType;
  raison: string;
};

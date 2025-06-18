import { Email, DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../..';

export type DemanderChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  actionnaire: string;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateDemande: DateTime.ValueType;
};

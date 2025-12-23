import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../../document-projet';

export type ModifierInstallateurOptions = {
  identifiantUtilisateur: Email.ValueType;
  installateur: string;
  dateModification: DateTime.ValueType;
  raison?: string;
  pièceJustificative?: DocumentProjet.ValueType;
};

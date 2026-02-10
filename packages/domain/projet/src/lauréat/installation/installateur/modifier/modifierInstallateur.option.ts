import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../../document-projet/index.js';

export type ModifierInstallateurOptions = {
  identifiantUtilisateur: Email.ValueType;
  installateur: string;
  dateModification: DateTime.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};

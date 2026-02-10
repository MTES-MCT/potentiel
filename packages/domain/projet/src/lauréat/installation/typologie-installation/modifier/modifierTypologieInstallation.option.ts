import { DateTime, Email } from '@potentiel-domain/common';

import { TypologieInstallation } from '../../../../candidature/index.js';
import { DocumentProjet } from '../../../../document-projet/index.js';

export type ModifierTypologieInstallationOptions = {
  identifiantUtilisateur: Email.ValueType;
  typologieInstallation: TypologieInstallation.ValueType[];
  dateModification: DateTime.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};

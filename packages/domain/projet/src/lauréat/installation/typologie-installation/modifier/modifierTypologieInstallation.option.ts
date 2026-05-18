import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';
import type { TypologieInstallation } from '../../../../candidature/index.js';

export type ModifierTypologieInstallationOptions = {
  identifiantUtilisateur: Email.ValueType;
  typologieInstallation: TypologieInstallation.ValueType[];
  dateModification: DateTime.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};

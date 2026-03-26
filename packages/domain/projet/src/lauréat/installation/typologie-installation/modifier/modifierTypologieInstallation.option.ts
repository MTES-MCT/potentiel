import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

import { TypologieInstallation } from '../../../../candidature/index.js';

export type ModifierTypologieInstallationOptions = {
  identifiantUtilisateur: Email.ValueType;
  typologieInstallation: TypologieInstallation.ValueType[];
  dateModification: DateTime.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};

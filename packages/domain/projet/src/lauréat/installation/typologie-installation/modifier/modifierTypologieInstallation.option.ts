import { DateTime, Email } from '@potentiel-domain/common';

import { TypologieInstallation } from '../../../../candidature';

export type ModifierTypologieInstallationOptions = {
  identifiantUtilisateur: Email.ValueType;
  typologieInstallation: TypologieInstallation.ValueType[];
  dateModification: DateTime.ValueType;
};

import { DateTime, Email } from '@potentiel-domain/common';

import { TypologieDuProjet } from '../../../../candidature';

export type ModifierTypologieDuProjetOptions = {
  identifiantUtilisateur: Email.ValueType;
  typologieDuProjet: TypologieDuProjet.ValueType[];
  dateModification: DateTime.ValueType;
};

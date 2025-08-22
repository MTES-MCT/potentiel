import type { DateTime, Email } from '@potentiel-domain/common';

import type { IdentifiantProjet } from '../../..';

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateModification: DateTime.ValueType;
};

import type { DateTime } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { RéférenceDossierRaccordement } from '../..';

export type ModifierDemandeComplèteOptions = {
  dateQualification: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatAccuséRéception: string;
  rôle: Role.ValueType;
};

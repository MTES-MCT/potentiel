import { DateTime } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { RéférenceDossierRaccordement } from '../..';

export type ModifierDemandeComplèteOptions = {
  dateQualification: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatAccuséRéception: string;
  rôle: Role.ValueType;
};

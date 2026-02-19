import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { RéférenceDossierRaccordement } from '../../index.js';

export type ModifierDemandeComplèteOptions = {
  dateQualification: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  rôle: Role.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
  formatAccuséRéception?: string;
};

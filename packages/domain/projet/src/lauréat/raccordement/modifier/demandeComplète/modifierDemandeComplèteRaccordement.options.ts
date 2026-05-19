import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { RéférenceDossierRaccordement } from '../../index.js';

export type ModifierDemandeComplèteOptions = {
  dateQualification: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  rôle: Role.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
  accuséRéception: { format: string };
  estUnNouveauDocument: boolean;
};

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { RéférenceDossierRaccordement } from '../../index.js';

export type SupprimerDossierDuRaccordementOptions = {
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar: Email.ValueType;
  rôle: Role.ValueType;
};

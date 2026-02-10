import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { RéférenceDossierRaccordement } from '../../index.js';

export type SupprimerDossierDuRaccordementOptions = {
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar: Email.ValueType;
  rôle: Role.ValueType;
};

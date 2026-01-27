import { DateTime, Email } from '@potentiel-domain/common';

import { RéférenceDossierRaccordement } from '../..';

export type SupprimerDossierDuRaccordementOptions = {
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar: Email.ValueType;
};

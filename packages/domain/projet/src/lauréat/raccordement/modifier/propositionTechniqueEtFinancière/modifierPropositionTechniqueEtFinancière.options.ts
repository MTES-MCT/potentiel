import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { RéférenceDossierRaccordement } from '../../index.js';

export type ModifierPropositionTechniqueEtFinancièreOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  propositionTechniqueEtFinancièreSignée: { format: string };
  estUnNouveauDocument: boolean;
  rôle: Role.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
};

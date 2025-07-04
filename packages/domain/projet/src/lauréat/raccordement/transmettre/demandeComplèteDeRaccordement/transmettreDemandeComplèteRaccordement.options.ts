import { DateTime, ExpressionRegulière, Email } from '@potentiel-domain/common';

import { RéférenceDossierRaccordement } from '../..';

export type TransmettreDemandeOptions = {
  dateQualification: DateTime.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
  transmisePar: Email.ValueType;
  transmiseLe: DateTime.ValueType;
  formatAccuséRéception?: string;
};

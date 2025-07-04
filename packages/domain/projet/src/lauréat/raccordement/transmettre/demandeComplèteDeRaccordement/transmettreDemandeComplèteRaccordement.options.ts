import { DateTime, ExpressionRegulière, Email } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { RéférenceDossierRaccordement } from '../..';
import { IdentifiantProjet } from '../../../..';

export type TransmettreDemandeOptions = {
  dateQualification: DateTime.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
  transmisePar: Email.ValueType;
  transmiseLe: DateTime.ValueType;
  formatAccuséRéception?: string;
  aUnAbandonAccordé: boolean;
};

import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { IdentifiantProjet } from '../../../index.js';

export type ChoisirCahierDesChargesOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.ValueType;
};

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime, Email } from '@potentiel-domain/common';

import type { IdentifiantProjet } from '../../../index.js';

export type ChoisirCahierDesChargesOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.ValueType;
};

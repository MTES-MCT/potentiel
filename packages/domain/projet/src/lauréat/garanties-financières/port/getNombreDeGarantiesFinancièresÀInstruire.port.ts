import type { DateTime } from '@potentiel-domain/common';
import type { Région } from '@potentiel-domain/utilisateur';

import type { ConsulterNombreDeGarantiesFinancièresÀInstruireReadModel } from '../consulterNombreDeGarantiesFinancièresÀInstruire.query.js';

export type GetNombreDeGarantiesFinancièresÀInstruirePort = (
  newBeforeDate: DateTime.RawType,
  régions: Région.RawType[],
) => Promise<ConsulterNombreDeGarantiesFinancièresÀInstruireReadModel>;

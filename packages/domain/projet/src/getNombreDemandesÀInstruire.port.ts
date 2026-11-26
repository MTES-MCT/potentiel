import type { DateTime } from '@potentiel-domain/common';
import type { Région, UserFiltersType } from '@potentiel-domain/utilisateur';

import type { ConsulterNombreDemandesÀInstruireReadModel } from './consulterNombreDemandesÀInstruire.query.js';

type DemandesProjetScope = ConsulterNombreDemandesÀInstruireReadModel;

export type GetNombreDemandesÀInstruire = (
  rôle: 'dreal' | 'dgec',
  newBeforeDate: DateTime.RawType,
  régions?: Région.RawType[],
  userFilters?: UserFiltersType,
) => Promise<DemandesProjetScope>;

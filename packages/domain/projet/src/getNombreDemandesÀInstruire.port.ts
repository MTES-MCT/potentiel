import type { DateTime } from '@potentiel-domain/common';
import type { Région } from '@potentiel-domain/utilisateur';

import type { ConsulterNombreDemandesÀInstruireReadModel } from './index.js';

type DemandesProjetScope = ConsulterNombreDemandesÀInstruireReadModel;

export type GetNombreDemandesÀInstruire = (
  rôle: 'dreal' | 'dgec',
  newBeforeDate: DateTime.RawType,
  régions?: Région.RawType[],
) => Promise<DemandesProjetScope>;

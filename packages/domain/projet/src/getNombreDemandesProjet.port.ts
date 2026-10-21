import type { DateTime } from '@potentiel-domain/common';
import type { Région } from '@potentiel-domain/utilisateur';

import type { DemandesEnInstructionListItemReadModel } from './index.js';

type DemandesProjetScope = DemandesEnInstructionListItemReadModel;

export type GetNombreDemandesProjet = (
  rôle: 'dreal' | 'dgec',
  date: DateTime.RawType,
  régions?: Région.RawType[],
) => Promise<DemandesProjetScope>;

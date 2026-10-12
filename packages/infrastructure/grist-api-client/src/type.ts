import type { DateTime } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { typesDeLien } from './constant.js';

export type TypeDeLien = (typeof typesDeLien)[number];

export type Nouveauté = {
  titre: string;
  description?: string;
  date?: DateTime.RawType;
  rôles: Array<Role.RawType>;
  lien?: {
    url: string;
    type: TypeDeLien;
  };
};

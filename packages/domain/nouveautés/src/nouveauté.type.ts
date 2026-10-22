import type { DateTime } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

export type Nouveauté = {
  titre: string;
  description?: string;
  date?: DateTime.RawType;
  rôles: Array<Role.RawType>;
  lien?: string;
};

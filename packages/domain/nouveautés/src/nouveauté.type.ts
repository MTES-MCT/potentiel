import type { DateTime } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

export const typesDeLien = ['interne', 'externe'] as const;

export type TypeDeLien = (typeof typesDeLien)[number];

export type LienNouveauté = { type: 'interne'; route: string } | { type: 'externe'; url: string };

export type Nouveauté = {
  titre: string;
  description?: string;
  date?: DateTime.RawType;
  rôles: Array<Role.RawType>;
  lien?: LienNouveauté;
};

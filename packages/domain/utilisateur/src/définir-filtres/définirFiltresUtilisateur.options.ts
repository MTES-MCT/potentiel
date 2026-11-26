import type { DateTime } from '@potentiel-domain/common';

import type { UserFiltersType } from '../filters.types.js';

export type DéfinirFiltresUtilisateurOptions = {
  définisLe: DateTime.ValueType;
  filtres: UserFiltersType;
};

import type { DateTime } from '@potentiel-domain/common';

import type { FiltersType } from '../filters.types.js';

export type DéfinirFiltresUtilisateurOptions = {
  définisLe: DateTime.ValueType;
  filtres: FiltersType;
};

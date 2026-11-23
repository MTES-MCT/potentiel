import type { DateTime } from '@potentiel-domain/common';

import type { Filters } from '../filters.types.js';

export type DéfinirFiltresUtilisateurOptions = {
  définiLe: DateTime.ValueType;
  filtres: Filters;
};

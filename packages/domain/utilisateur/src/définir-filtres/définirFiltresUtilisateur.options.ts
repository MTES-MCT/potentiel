import type { DateTime } from '@potentiel-domain/common';

import type { Type } from '../filters.types.js';

export type DéfinirFiltresUtilisateurOptions = {
  définisLe: DateTime.ValueType;
  filtres: Type;
};

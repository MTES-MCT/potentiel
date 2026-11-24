import type { DateTime } from '@potentiel-domain/common';

import type { Filters } from '../utilisateur.valueType.js';

export type DéfinirFiltresUtilisateurOptions = {
  définiLe: DateTime.ValueType;
  filtres: Filters;
};

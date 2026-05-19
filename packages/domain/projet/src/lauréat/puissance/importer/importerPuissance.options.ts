import type { DateTime } from '@potentiel-domain/common';

export type ImporterOptions = {
  puissance: number;
  puissanceDeSite?: number;
  importéeLe: DateTime.ValueType;
};

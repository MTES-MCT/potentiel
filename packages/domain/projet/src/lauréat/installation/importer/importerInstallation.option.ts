import { DateTime, Email } from '@potentiel-domain/common';

import { TypologieDuProjet } from '../../../candidature';

export type ImporterOptions = {
  importéPar: Email.ValueType;
  importéLe: DateTime.ValueType;
  installateur?: string;
  typologieDuProjet: TypologieDuProjet.ValueType[];
};

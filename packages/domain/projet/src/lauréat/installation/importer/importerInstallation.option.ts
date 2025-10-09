import { DateTime, Email } from '@potentiel-domain/common';

import { TypologieInstallation } from '../../../candidature';

export type ImporterOptions = {
  importéPar: Email.ValueType;
  importéLe: DateTime.ValueType;
  installateur?: string;
  typologieInstallation: TypologieInstallation.ValueType[];
};

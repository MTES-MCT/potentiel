import { DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type ActionnaireImportéEvent = DomainEvent<
  'ActionnaireImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    importéLe: DateTime.RawType;
  }
>;

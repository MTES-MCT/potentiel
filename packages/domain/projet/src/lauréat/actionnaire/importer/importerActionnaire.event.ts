import type { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

export type ActionnaireImportéEvent = DomainEvent<
  'ActionnaireImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    importéLe: DateTime.RawType;
  }
>;

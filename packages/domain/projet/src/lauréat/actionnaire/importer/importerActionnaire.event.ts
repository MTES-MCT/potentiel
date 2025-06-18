import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

export type ActionnaireImportéEvent = DomainEvent<
  'ActionnaireImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    importéLe: DateTime.RawType;
  }
>;

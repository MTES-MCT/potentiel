import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type InstallateurImportéEvent = DomainEvent<
  'InstallateurImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installateur?: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

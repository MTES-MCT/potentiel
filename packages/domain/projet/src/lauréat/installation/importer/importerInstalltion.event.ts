import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';
export type InstallationImportéeEvent = DomainEvent<
  'InstallationImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installateur: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

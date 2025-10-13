import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';
import { TypologieInstallation } from '../../../candidature';
export type InstallationImportéeEvent = DomainEvent<
  'InstallationImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installateur: string;
    typologieInstallation: TypologieInstallation.RawType[];
    importéeLe: DateTime.RawType;
    importéePar: Email.RawType;
  }
>;

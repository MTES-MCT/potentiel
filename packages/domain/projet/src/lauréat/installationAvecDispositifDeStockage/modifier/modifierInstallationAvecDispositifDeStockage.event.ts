import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type InstallationAvecDispositifDeStockageModifiéeEvent = DomainEvent<
  'InstallationAvecDispositifDeStockageModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installationAvecDispositifDeStockage: boolean;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;

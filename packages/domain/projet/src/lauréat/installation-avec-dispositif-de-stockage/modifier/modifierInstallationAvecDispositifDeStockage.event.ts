import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';
import { DispositifDeStockage } from '..';

export type InstallationAvecDispositifDeStockageModifiéeEvent = DomainEvent<
  'InstallationAvecDispositifDeStockageModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    // installationAvecDispositifDeStockage: boolean;
    dispositifDeStockage: DispositifDeStockage.RawType;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;

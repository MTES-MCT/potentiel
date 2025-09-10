import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type InstallationAvecDispositifDeStockageModifiéEvent = DomainEvent<
  'InstallationAvecDispositifDeStockageModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installationAvecDispositifDeStockage: boolean;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  }
>;

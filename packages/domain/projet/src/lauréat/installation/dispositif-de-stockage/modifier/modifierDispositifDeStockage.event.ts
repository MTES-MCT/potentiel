import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../../index.js';
import { DispositifDeStockage } from '../../index.js';

export type DispositifDeStockageModifiéEvent = DomainEvent<
  'DispositifDeStockageModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dispositifDeStockage: DispositifDeStockage.RawType;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../..';

export type DélaiDemandéEvent = DomainEvent<
  'DélaiDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nombreDeMois: number;
    raison: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

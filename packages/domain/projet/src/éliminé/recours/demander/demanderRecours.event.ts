import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

export type RecoursDemandéEvent = DomainEvent<
  'RecoursDemandé-V1',
  {
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

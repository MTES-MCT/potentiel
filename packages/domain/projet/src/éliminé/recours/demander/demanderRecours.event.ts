import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';

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

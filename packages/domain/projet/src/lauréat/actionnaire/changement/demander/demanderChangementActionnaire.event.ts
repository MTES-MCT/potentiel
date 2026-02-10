import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../../index.js';

export type ChangementActionnaireDemandéEvent = DomainEvent<
  'ChangementActionnaireDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    raison: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

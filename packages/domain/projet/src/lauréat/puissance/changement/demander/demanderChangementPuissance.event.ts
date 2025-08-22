import type { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { AutoritéCompétente } from '../..';

export type ChangementPuissanceDemandéEvent = DomainEvent<
  'ChangementPuissanceDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    autoritéCompétente: AutoritéCompétente.RawType;
    raison: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

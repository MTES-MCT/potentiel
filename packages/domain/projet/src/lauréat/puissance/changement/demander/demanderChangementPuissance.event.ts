import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { AutoritéCompétente } from '../..';
import { IdentifiantProjet } from '../../../..';

export type ChangementPuissanceDemandéEvent = DomainEvent<
  'ChangementPuissanceDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    puissanceDeSite?: number;
    autoritéCompétente: AutoritéCompétente.RawType;
    raison: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

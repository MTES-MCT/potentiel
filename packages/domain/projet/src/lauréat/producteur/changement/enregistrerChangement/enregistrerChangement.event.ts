import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../..';

export type ChangementProducteurEnregistréEvent = DomainEvent<
  'ChangementProducteurEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison?: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

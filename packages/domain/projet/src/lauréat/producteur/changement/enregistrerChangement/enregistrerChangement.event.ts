import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';

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

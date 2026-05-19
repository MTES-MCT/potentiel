import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { NuméroIdentification } from '../../index.js';

export type ChangementProducteurEnregistréEvent = DomainEvent<
  'ChangementProducteurEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    numéroIdentification?: NuméroIdentification.RawType;
    raison?: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../../index.js';

export type DemandeDélaiPasséeEnInstructionEvent = DomainEvent<
  'DemandeDélaiPasséeEnInstruction-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    passéeEnInstructionLe: DateTime.RawType;
    passéeEnInstructionPar: Email.RawType;
    dateDemande: DateTime.RawType;
  }
>;

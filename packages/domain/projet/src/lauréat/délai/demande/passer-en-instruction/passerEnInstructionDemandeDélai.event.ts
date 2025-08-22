import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../..';

export type DemandeDélaiPasséeEnInstructionEvent = DomainEvent<
  'DemandeDélaiPasséeEnInstruction-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    passéeEnInstructionLe: DateTime.RawType;
    passéeEnInstructionPar: Email.RawType;
    dateDemande: DateTime.RawType;
  }
>;

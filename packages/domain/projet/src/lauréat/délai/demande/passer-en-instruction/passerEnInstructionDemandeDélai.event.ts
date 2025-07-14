import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../..';

export type DemandeDélaiPasséeEnInstructionEvent = DomainEvent<
  'DemandeDélaiPasséeEnInstruction-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    passéEnInstructionLe: DateTime.RawType;
    passéEnInstructionPar: Email.RawType;
    dateDemande: DateTime.RawType;
  }
>;

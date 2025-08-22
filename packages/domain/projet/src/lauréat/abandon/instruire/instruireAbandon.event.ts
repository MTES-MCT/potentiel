import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../..';

export type AbandonPasséEnInstructionEvent = DomainEvent<
  'AbandonPasséEnInstruction-V1',
  {
    passéEnInstructionLe: DateTime.RawType;
    passéEnInstructionPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

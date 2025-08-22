import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../..';

export type ÉvaluationCarboneModifiéeEvent = DomainEvent<
  'ÉvaluationCarboneSimplifiéeModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    évaluationCarboneSimplifiée: number;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;

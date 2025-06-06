import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type ÉvaluationCarboneModifiéeEvent = DomainEvent<
  'ÉvaluationCarboneModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    évaluationCarboneSimplifiée: number;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;

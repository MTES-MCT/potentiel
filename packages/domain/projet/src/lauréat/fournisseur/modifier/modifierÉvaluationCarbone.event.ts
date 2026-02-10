import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

export type ÉvaluationCarboneModifiéeEvent = DomainEvent<
  'ÉvaluationCarboneSimplifiéeModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    évaluationCarboneSimplifiée: number;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;

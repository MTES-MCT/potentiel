import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type PuissanceModifiéeEvent = DomainEvent<
  'PuissanceModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    puissanceDeSite?: number;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
    raison?: string;
  }
>;

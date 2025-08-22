import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../..';

export type ProducteurModifiéEvent = DomainEvent<
  'ProducteurModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  }
>;

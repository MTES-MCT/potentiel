import { DomainEvent } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

import { AttestationConformitéEvent } from './attestationConformité';

export type DatePrévisionnelleCalculéeEvent = DomainEvent<
  'DatePrévisionnelleCalculée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    date: DateTime.RawType;
  }
>;

export type AchèvementEvent = AttestationConformitéEvent | DatePrévisionnelleCalculéeEvent;

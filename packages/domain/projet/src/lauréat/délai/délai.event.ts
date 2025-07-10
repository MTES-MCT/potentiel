import { DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../..';

import { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';

export type DélaiAccordéEvent = DomainEvent<
  'DélaiAccordé-V1',
  {
    raison: 'covid' | 'demande' | 'cdc-18-mois';
    durée: number;
    accordéLe: DateTime.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type DélaiEvent = DélaiAccordéEvent | DélaiDemandéEvent;

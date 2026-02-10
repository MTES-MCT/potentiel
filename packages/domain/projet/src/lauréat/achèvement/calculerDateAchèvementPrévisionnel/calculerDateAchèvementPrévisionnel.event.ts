import { DomainEvent } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

export type DateAchèvementPrévisionnelCalculéeEvent = DomainEvent<
  'DateAchèvementPrévisionnelCalculée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    date: DateTime.RawType;
    raison:
      | 'notification'
      | 'covid'
      | 'ajout-délai-cdc-30_08_2022'
      | 'retrait-délai-cdc-30_08_2022'
      | 'délai-accordé'
      | 'inconnue';
  }
>;

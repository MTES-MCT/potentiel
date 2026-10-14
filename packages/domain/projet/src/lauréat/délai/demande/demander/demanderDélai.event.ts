import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { MotifDemandeDélai } from '../../index.js';

/**
 * @deprecated Évènement déprécié, utiliser DélaiDemandéEvent-V2 à la place.
 * La V2 ajoute un motif requis.
 * On considèrera que le motif est "force-majeure" pour la V1
 */
export type DélaiDemandéEventV1 = DomainEvent<
  'DélaiDemandé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nombreDeMois: number;
    raison: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
  }
>;

export type DélaiDemandéEvent = DomainEvent<
  'DélaiDemandé-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nombreDeMois: number;
    raison: string;
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    pièceJustificative: {
      format: string;
    };
    motif: MotifDemandeDélai.RawType;
  }
>;

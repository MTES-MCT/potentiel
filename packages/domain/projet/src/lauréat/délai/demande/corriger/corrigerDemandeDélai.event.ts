import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { MotifDemandeDélai } from '../../index.js';

/**
 * @deprecated Évènement déprécié, utiliser DemandeDélaiCorrigée-V2 à la place.
 * La V2 ajoute un motif requis.
 * On considèrera que le motif est "prolongation-délai-achèvement" pour la V1
 */
export type DemandeDélaiCorrigéeEventV1 = DomainEvent<
  'DemandeDélaiCorrigée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateDemande: DateTime.RawType;
    nombreDeMois: number;
    raison: string;
    corrigéeLe: DateTime.RawType;
    corrigéePar: Email.RawType;
    pièceJustificative?: {
      format: string;
    };
  }
>;

export type DemandeDélaiCorrigéeEvent = DomainEvent<
  'DemandeDélaiCorrigée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateDemande: DateTime.RawType;
    nombreDeMois: number;
    raison: string;
    motif: MotifDemandeDélai.RawType;
    corrigéeLe: DateTime.RawType;
    corrigéePar: Email.RawType;
    pièceJustificative?: {
      format: string;
    };
  }
>;

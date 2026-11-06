import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { MotifDemandeDélai } from '../../index.js';

/**
 * @deprecated Évènement déprécié, utiliser DemandeDélaiAnnulée-V2 à la place.
 * La V2 ajoute un motif requis.
 * On considèrera que le motif est "prolongation-délai-achèvement" pour la V1
 */
export type DemandeDélaiAnnuléeEventV1 = DomainEvent<
  'DemandeDélaiAnnulée-V1',
  {
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    dateDemande: DateTime.RawType;
  }
>;

export type DemandeDélaiAnnuléeEvent = DomainEvent<
  'DemandeDélaiAnnulée-V2',
  {
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    dateDemande: DateTime.RawType;
    motifDemande: MotifDemandeDélai.RawType;
  }
>;

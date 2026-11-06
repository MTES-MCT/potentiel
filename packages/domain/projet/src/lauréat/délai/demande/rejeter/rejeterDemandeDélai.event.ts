import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { MotifDemandeDélai } from '../../index.js';

/**
 * @deprecated Évènement déprécié, utiliser DemandeDélaiRejetée-V2 à la place.
 * La V2 ajoute un motif requis.
 * On considèrera que le motif est "prolongation-délai-achèvement" pour la V1
 */
export type DemandeDélaiRejetéeEventV1 = DomainEvent<
  'DemandeDélaiRejetée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateDemande: DateTime.RawType;
    rejetéeLe: DateTime.RawType;
    rejetéePar: Email.RawType;
    réponseSignée: { format: string };
  }
>;

export type DemandeDélaiRejetéeEvent = DomainEvent<
  'DemandeDélaiRejetée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateDemande: DateTime.RawType;
    rejetéeLe: DateTime.RawType;
    rejetéePar: Email.RawType;
    réponseSignée: { format: string };
    motifDemande: MotifDemandeDélai.RawType;
  }
>;

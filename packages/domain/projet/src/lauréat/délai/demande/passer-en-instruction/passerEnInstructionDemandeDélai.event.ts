import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { MotifDemandeDélai } from '../../index.js';

/**
 * @deprecated Évènement déprécié, utiliser DemandeDélaiPasséeEnInstruction-V2 à la place.
 * La V2 ajoute un motif requis.
 * On considèrera que le motif est "prolongation-délai-achèvement" pour la V1
 */
export type DemandeDélaiPasséeEnInstructionEventV1 = DomainEvent<
  'DemandeDélaiPasséeEnInstruction-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    passéeEnInstructionLe: DateTime.RawType;
    passéeEnInstructionPar: Email.RawType;
    dateDemande: DateTime.RawType;
  }
>;

export type DemandeDélaiPasséeEnInstructionEvent = DomainEvent<
  'DemandeDélaiPasséeEnInstruction-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    passéeEnInstructionLe: DateTime.RawType;
    passéeEnInstructionPar: Email.RawType;
    dateDemande: DateTime.RawType;
    motifDemande: MotifDemandeDélai.RawType;
  }
>;

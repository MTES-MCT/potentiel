import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { MotifDemandeDélai } from '../../index.js';

/**
 * @deprecated Évènement déprécié, utiliser DélaiAccordéEvent-V2 à la place.
 * La V2 ajoute un motif requis.
 * On considèrera que le motif est "prolongation-délai-achèvement" pour la V1
 */
export type DélaiAccordéEventV1 = DomainEvent<
  'DélaiAccordé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nombreDeMois: number;
    dateAchèvementPrévisionnelCalculée: DateTime.RawType;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    dateDemande: DateTime.RawType;
    réponseSignée: { format: string };
  }
>;

export type DélaiAccordéEvent = DomainEvent<
  'DélaiAccordé-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nombreDeMois: number;
    dateAchèvementPrévisionnelCalculée: DateTime.RawType;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    dateDemande: DateTime.RawType;
    réponseSignée: { format: string };
    motif: MotifDemandeDélai.RawType;
  }
>;

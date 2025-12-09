import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../..';

/**
 * @deprecated use AbandonDemandéEvent instead
 * Aucune demande avec recandidature n'est désormais possible
 */
export type AbandonDemandéEventV1 = DomainEvent<
  'AbandonDemandé-V1',
  {
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    raison: string;
    recandidature: boolean;
    pièceJustificative?: {
      format: string;
    };
  }
>;

export type AbandonDemandéEvent = DomainEvent<
  'AbandonDemandé-V2',
  {
    demandéLe: DateTime.RawType;
    demandéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

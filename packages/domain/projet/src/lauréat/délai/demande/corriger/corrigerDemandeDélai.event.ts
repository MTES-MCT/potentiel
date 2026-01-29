import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../..';

export type DemandeDélaiCorrigéeEvent = DomainEvent<
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

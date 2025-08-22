import type { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

export type ChangementPuissanceEnregistréEvent = DomainEvent<
  'ChangementPuissanceEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

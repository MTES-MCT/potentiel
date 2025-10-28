import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

export type ChangementPuissanceEnregistréEvent = DomainEvent<
  'ChangementPuissanceEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    puissanceDeSite?: number;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

export type ChangementNomProjetEnregistréEvent = DomainEvent<
  'ChangementNomProjetEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomProjet: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

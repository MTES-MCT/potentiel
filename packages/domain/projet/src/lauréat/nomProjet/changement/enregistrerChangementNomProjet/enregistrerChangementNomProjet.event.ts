import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../../index.js';

export type ChangementNomProjetEnregistréEvent = DomainEvent<
  'ChangementNomProjetEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nomProjet: string;
    ancienNomProjet: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

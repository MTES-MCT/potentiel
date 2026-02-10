import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../../index.js';

export type ChangementActionnaireEnregistréEvent = DomainEvent<
  'ChangementActionnaireEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

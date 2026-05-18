import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../../index.js';

export type ChangementInstallateurEnregistréEvent = DomainEvent<
  'ChangementInstallateurEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installateur: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

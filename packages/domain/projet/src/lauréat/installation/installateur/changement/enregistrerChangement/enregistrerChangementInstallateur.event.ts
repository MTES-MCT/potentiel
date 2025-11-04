import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../../..';

export type ChangementInstallateurEnregistréEvent = DomainEvent<
  'ChangementInstallateurEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installateur: string;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

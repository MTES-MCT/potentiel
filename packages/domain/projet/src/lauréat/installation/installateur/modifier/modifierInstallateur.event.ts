import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../..';

export type InstallateurModifiéEvent = DomainEvent<
  'InstallateurModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    installateur: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';

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

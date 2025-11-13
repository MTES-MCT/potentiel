import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type ActionnaireModifiéEvent = DomainEvent<
  'ActionnaireModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    actionnaire: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

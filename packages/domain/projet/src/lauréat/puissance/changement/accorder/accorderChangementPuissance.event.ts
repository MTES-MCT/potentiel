import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../..';

export type ChangementPuissanceAccordéEvent = DomainEvent<
  'ChangementPuissanceAccordé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nouvellePuissance: number;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    réponseSignée?: {
      format: string;
    };
    estUneDécisionDEtat?: true;
  }
>;

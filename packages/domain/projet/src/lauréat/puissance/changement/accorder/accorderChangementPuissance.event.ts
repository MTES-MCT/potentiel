import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../../index.js';

export type ChangementPuissanceAccordéEvent = DomainEvent<
  'ChangementPuissanceAccordé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nouvellePuissance: number;
    nouvellePuissanceDeSite?: number;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    réponseSignée?: {
      format: string;
    };
    estUneDécisionDEtat?: true;
  }
>;

import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';

export type DélaiAccordéEvent = DomainEvent<
  'DélaiAccordé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    nombreDeMois: number;
    dateAchèvementPrévisionnelCalculée: DateTime.RawType;
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    dateDemande: DateTime.RawType;
    réponseSignée: { format: string };
  }
>;

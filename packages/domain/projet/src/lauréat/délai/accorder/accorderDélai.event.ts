import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

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

export type LegacyDélaiAccordéEvent = DomainEvent<
  'LegacyDélaiAccordé-V1',
  {
    raison: 'covid' | 'demande' | 'cdc-18-mois';
    nombreDeMois: number;
    accordéLe: DateTime.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

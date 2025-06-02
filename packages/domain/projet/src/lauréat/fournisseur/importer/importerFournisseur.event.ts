import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type FournisseurImportéEvent = DomainEvent<
  'FournisseurImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    évaluationCarboneSimplifiée: number;
    details: string;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';
import { ChampsFournisseurDétails } from '../types';

export type FournisseurImportéEvent = DomainEvent<
  'FournisseurImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    évaluationCarboneSimplifiée: number;
    details: ChampsFournisseurDétails;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

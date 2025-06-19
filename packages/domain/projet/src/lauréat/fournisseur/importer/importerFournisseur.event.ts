import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';
import { Fournisseur } from '..';

export type FournisseurImportéEvent = DomainEvent<
  'FournisseurImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    évaluationCarboneSimplifiée: number;
    fournisseurs: Array<Fournisseur.RawType>;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

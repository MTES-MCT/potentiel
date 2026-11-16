import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';
import type { Fournisseur } from '../index.js';

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

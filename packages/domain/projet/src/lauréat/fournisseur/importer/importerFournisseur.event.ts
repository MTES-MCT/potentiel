import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';
import { Fournisseur } from '../index.js';

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

import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';
import { TypeFournisseur } from '..';

export type FournisseurImportéEvent = DomainEvent<
  'FournisseurImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    évaluationCarboneSimplifiée: number;
    fournisseurs: Array<{
      typeFournisseur: TypeFournisseur.RawType;
      nomDuFabricant: string;
    }>;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;

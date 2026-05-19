import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { Fournisseur } from '../../index.js';

export type FournisseurModifiéEvent = DomainEvent<
  'FournisseurModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    fournisseurs?: Array<Fournisseur.RawType>;
    évaluationCarboneSimplifiée?: number;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';
import type { Fournisseur } from '../../index.js';

export type ChangementFournisseurEnregistréEvent = DomainEvent<
  'ChangementFournisseurEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    fournisseurs?: Array<Fournisseur.RawType>;
    évaluationCarboneSimplifiée?: number;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

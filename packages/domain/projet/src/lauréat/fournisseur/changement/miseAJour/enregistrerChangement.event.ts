import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../../index.js';
import { Fournisseur } from '../../index.js';

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

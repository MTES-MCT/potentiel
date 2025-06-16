import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';
import { TypeFournisseur } from '../..';

export type ChangementFournisseurEnregistréEvent = DomainEvent<
  'ChangementFournisseurEnregistré-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    fournisseurs?: Array<{
      typeFournisseur: TypeFournisseur.RawType;
      nomDuFabricant: string;
    }>;
    évaluationCarboneSimplifiée?: number;
    enregistréLe: DateTime.RawType;
    enregistréPar: Email.RawType;
    raison: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

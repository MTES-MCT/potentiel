import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { TypeFournisseur } from '..';

export type ChangementFournisseurEntity = Entity<
  'changement-fournisseur',
  {
    identifiantProjet: string;

    changement: {
      enregistréPar: string;
      enregistréLe: DateTime.RawType;
      // TODO non nullable
      fournisseurs?: Array<{
        typeFournisseur: TypeFournisseur.RawType;
        nomDuFabricant: string;
      }>;
      évaluationCarboneSimplifiée?: number;
      raison: string;
      pièceJustificative: {
        format: string;
      };
    };
  }
>;

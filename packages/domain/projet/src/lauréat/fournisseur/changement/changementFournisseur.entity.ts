import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { Fournisseur } from '../index.js';

export type ChangementFournisseurEntity = Entity<
  'changement-fournisseur',
  {
    identifiantProjet: string;

    changement: {
      enregistréPar: string;
      enregistréLe: DateTime.RawType;
      fournisseurs?: Array<Fournisseur.RawType>;
      évaluationCarboneSimplifiée?: number;
      raison: string;
      pièceJustificative: {
        format: string;
      };
    };
  }
>;

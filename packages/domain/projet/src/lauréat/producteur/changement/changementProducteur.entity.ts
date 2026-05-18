import type { DateTime } from '@potentiel-domain/common';
import type { Entity } from '@potentiel-domain/entity';

import type { NuméroIdentification } from '../index.js';

export type ChangementProducteurEntity = Entity<
  'changement-producteur',
  {
    identifiantProjet: string;
    changement: {
      enregistréPar: string;
      enregistréLe: DateTime.RawType;
      ancien: {
        producteur: string;
        numéroIdentification?: NuméroIdentification.RawType;
      };
      nouveau: {
        producteur: string;
        numéroIdentification?: NuméroIdentification.RawType;
      };
      raison?: string;
      pièceJustificative: {
        format: string;
      };
    };
  }
>;

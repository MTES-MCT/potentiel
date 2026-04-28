import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { NuméroImmatriculation } from '../index.js';

export type ChangementProducteurEntity = Entity<
  'changement-producteur',
  {
    identifiantProjet: string;
    changement: {
      enregistréPar: string;
      enregistréLe: DateTime.RawType;
      ancien: {
        producteur: string;
        numéroImmatriculation?: NuméroImmatriculation.RawType;
      };
      nouveau: {
        producteur: string;
        numéroImmatriculation?: NuméroImmatriculation.RawType;
      };
      raison?: string;
      pièceJustificative: {
        format: string;
      };
    };
  }
>;

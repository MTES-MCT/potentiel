import { Entity } from '@potentiel-domain/entity';

import { AutoritéCompétente, StatutDemandeDélai } from '../index.js';

export type DemandeDélaiEntity = Entity<
  'demande-délai',
  {
    identifiantProjet: string;

    miseÀJourLe: string;

    statut: StatutDemandeDélai.RawType;
    nombreDeMois: number;
    raison: string;
    demandéLe: string;
    demandéPar: string;
    pièceJustificative: {
      format: string;
    };
    autoritéCompétente?: AutoritéCompétente.RawType;

    correction?: {
      corrigéeLe: string;
      corrigéePar: string;
    };

    instruction?: {
      passéeEnInstructionLe: string;
      passéeEnInstructionPar: string;
    };

    accord?: {
      accordéeLe: string;
      accordéePar: string;
      nombreDeMois: number;
      dateAchèvementPrévisionnelCalculée: string;
      réponseSignée: {
        format: string;
      };
    };

    rejet?: {
      rejetéeLe: string;
      rejetéePar: string;
      motif: string;
      réponseSignée: {
        format: string;
      };
    };
  }
>;

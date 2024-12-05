import { Entity } from '@potentiel-domain/entity';

export type DemandeChangementReprésentantLégalEntity = Entity<
  'demande-changement-représentant-légal',
  {
    identifiantProjet: string;
    statut: string;
    nomReprésentantLégal: string;
    typeReprésentantLégal: string;
    demandéLe: string;
    demandéPar: string;
    piècesJustificatives: Array<{
      format: string;
    }>;
  }
>;

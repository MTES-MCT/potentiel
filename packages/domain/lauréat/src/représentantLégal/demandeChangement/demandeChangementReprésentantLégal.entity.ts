import { Entity } from '@potentiel-domain/entity';

export type DemandeChangementReprésentantLégalEntity = Entity<
  'demande-changement-représentant-légal',
  {
    identifiantProjet: string;
    projet: {
      nom: string;
      appelOffre: string;
      période: string;
      famille?: string;
      numéroCRE: string;
      région: string;
    };
    statut: string;
    nomReprésentantLégal: string;
    typeReprésentantLégal: string;
    demandéLe: string;
    demandéPar: string;
    pièceJustificative: {
      format: string;
    };
  }
>;

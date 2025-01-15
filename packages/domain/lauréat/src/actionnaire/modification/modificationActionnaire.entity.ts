import { Entity } from '@potentiel-domain/entity';

export type ModificationActionnaireEntity = Entity<
  'modification-actionnaire',
  {
    identifiantProjet: string;

    projet: {
      nomProjet: string;
      appelOffre: string;
      période: string;
      famille?: string;
      régionProjet: string;
    };

    modifiéLe: string;
    modifiéPar: string;
    actionnaire: string;
    raison: string;
    pièceJustificative?: {
      format: string;
    };
  }
>;

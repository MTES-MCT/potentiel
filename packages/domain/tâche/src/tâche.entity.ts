import { Projection } from '@potentiel-domain/entity';

export type TâcheEntity = Projection<
  'tâche',
  {
    identifiantProjet: string;

    nomProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;

    typeTâche: string;
    misÀJourLe: string;
  }
>;

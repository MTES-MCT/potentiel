import { Projection } from '@potentiel-libraries/projection';

// TODO: Doit on doit vraiment nommé les entités avec Projection, sachant que cela indique qu'on fait de l'ES dans l'infrastructure ???
export type TâcheProjection = Projection<
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

import { Projection } from '@potentiel-libraries/projection';

export type AppelOffreProjection = Projection<
  'appel-offre',
  {
    id: string;
    shortTitle: string;
    title: string;
    unitePuissance: string;
    donnéesCourriersRéponse: {
      texteEngagementRéalisationEtModalitésAbandon?: {
        référenceParagraphe: string;
        dispositions: string;
      };
    };
    periodes: Array<{
      id: string;
      title: string;
    }>;
  }
>;

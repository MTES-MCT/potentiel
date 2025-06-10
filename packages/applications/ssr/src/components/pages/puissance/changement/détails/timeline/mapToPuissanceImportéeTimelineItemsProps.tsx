import { Lauréat } from '@potentiel-domain/projet';
import { Historique } from '@potentiel-domain/historique';

import { HistoriquePuissanceTimelineProps } from '.';

export const mapToPuissanceImportéeTimelineItemsProps = (
  record: Historique.HistoriquePuissanceProjetListItemReadModel,
  unitéPuissance: HistoriquePuissanceTimelineProps['unitéPuissance'],
) => {
  const { importéeLe, puissance } =
    record.payload as Lauréat.Puissance.PuissanceImportéeEvent['payload'];

  return {
    date: importéeLe,
    title: (
      <div>
        Candidature :{' '}
        {
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        }
      </div>
    ),
  };
};

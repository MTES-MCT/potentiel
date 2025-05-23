import { Lauréat } from '@potentiel-domain/projet';

import { PuissanceHistoryRecord, HistoriquePuissanceTimelineProps } from '.';

export const mapToPuissanceImportéeTimelineItemsProps = (
  record: PuissanceHistoryRecord,
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

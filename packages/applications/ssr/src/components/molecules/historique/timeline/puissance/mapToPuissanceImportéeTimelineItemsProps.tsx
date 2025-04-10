import { Puissance } from '@potentiel-domain/laureat';

import { PuissanceHistoryRecord } from '.';

export const mapToPuissanceImportéeTimelineItemsProps = (record: PuissanceHistoryRecord) => {
  const { importéeLe, puissance } = record.payload as Puissance.PuissanceImportéeEvent['payload'];

  return {
    date: importéeLe,
    title: (
      <div>
        Candidature :{' '}
        {
          <span className="font-semibold">
            {puissance} {record.unitePuissance}
          </span>
        }
      </div>
    ),
  };
};

import { Puissance } from '@potentiel-domain/laureat';

import { PuissanceHistoryRecord } from '.';

export const mapToPuissanceModifiéeTimelineItemsProps = (record: PuissanceHistoryRecord) => {
  const { modifiéeLe, modifiéePar, puissance, raison } =
    record.payload as Puissance.PuissanceModifiéeEvent['payload'];

  return {
    date: modifiéeLe,
    title: <div>Puissance modifiée par {<span className="font-semibold">{modifiéePar}</span>}</div>,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {puissance} {record.unitePuissance}
          </span>
        </div>
        {raison && (
          <div>
            Raison : <span className="font-semibold">{raison}</span>
          </div>
        )}
      </div>
    ),
  };
};

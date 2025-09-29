import { Lauréat } from '@potentiel-domain/projet';

import { ReadMore } from '@/components/atoms/ReadMore';

export const mapToPuissanceModifiéeTimelineItemsProps = (
  record: Lauréat.Puissance.PuissanceModifiéeEvent,
  unitéPuissance: string,
) => {
  const { modifiéeLe, modifiéePar, puissance, raison } = record.payload;

  return {
    date: modifiéeLe,
    title: <div>Puissance modifiée par {<span className="font-semibold">{modifiéePar}</span>}</div>,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        </div>
        {raison && (
          <div>
            Raison : <ReadMore text={raison} className="font-semibold" />
          </div>
        )}
      </div>
    ),
  };
};

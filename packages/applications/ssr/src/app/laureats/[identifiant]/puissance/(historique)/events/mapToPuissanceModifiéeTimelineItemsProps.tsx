import { Lauréat } from '@potentiel-domain/projet';

import { ReadMore } from '@/components/atoms/ReadMore';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToPuissanceModifiéeTimelineItemsProps = (
  record: Lauréat.Puissance.PuissanceModifiéeEvent,
  unitéPuissance: string,
) => {
  const { modifiéeLe, modifiéePar, puissance, raison } = record.payload;

  return {
    date: modifiéeLe,
    title: (
      <div>
        Puissance modifiée <TimelineItemUserEmail email={modifiéePar} />
      </div>
    ),
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

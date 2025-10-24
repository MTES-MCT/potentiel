import { Lauréat } from '@potentiel-domain/projet';

import { ReadMore } from '@/components/atoms/ReadMore';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPuissanceModifiéeTimelineItemsProps = (
  event: Lauréat.Puissance.PuissanceModifiéeEvent,
  unitéPuissance: string,
): TimelineItemProps => {
  const { modifiéeLe, modifiéePar, puissance, raison, puissanceDeSite } = event.payload;

  return {
    date: modifiéeLe,
    title: 'Puissance modifiée',
    acteur: modifiéePar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        </div>
        {puissanceDeSite !== undefined && (
          <div>
            Nouvelle puissance de site :{' '}
            <span className="font-semibold">
              {puissanceDeSite} {unitéPuissance}
            </span>
          </div>
        )}
        {raison && (
          <div>
            Raison : <ReadMore text={raison} className="font-semibold" />
          </div>
        )}
      </div>
    ),
  };
};

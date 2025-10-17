import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPuissanceImportéeTimelineItemsProps = (
  event: Lauréat.Puissance.PuissanceImportéeEvent,
  unitéPuissance: string,
): TimelineItemProps => {
  const { importéeLe, puissance } = event.payload;

  return {
    date: importéeLe,
    title: (
      <>
        Candidature :{' '}
        {
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        }
      </>
    ),
  };
};

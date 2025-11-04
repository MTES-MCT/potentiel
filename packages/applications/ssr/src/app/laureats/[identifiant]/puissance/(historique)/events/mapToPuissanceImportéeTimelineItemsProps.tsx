import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPuissanceImportéeTimelineItemsProps = (
  event: Lauréat.Puissance.PuissanceImportéeEvent,
  unitéPuissance: string,
): TimelineItemProps => {
  const { importéeLe, puissance, puissanceDeSite } = event.payload;

  return {
    date: importéeLe,
    title: (
      <>
        Candidature :{' '}
        {
          <div className="flex flex-col gap-2">
            <div>
              Puissance :{' '}
              <span className="font-semibold">
                {puissance} {unitéPuissance}
              </span>
            </div>
            {puissanceDeSite !== undefined && (
              <div>
                Puissance de site :{' '}
                <span className="font-semibold">
                  {puissanceDeSite} {unitéPuissance}
                </span>
              </div>
            )}
          </div>
        }
      </>
    ),
  };
};

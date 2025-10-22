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
          <ul className="list-disc pl-4">
            <li>
              Puissance :{' '}
              <span className="font-semibold">
                {puissance} {unitéPuissance}
              </span>
            </li>
            {puissanceDeSite !== undefined ? (
              <li>
                Puissance de site :{' '}
                <span className="font-semibold">
                  {puissanceDeSite} {unitéPuissance}
                </span>
              </li>
            ) : null}
          </ul>
        }
      </>
    ),
  };
};

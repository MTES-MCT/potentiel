import { Lauréat } from '@potentiel-domain/projet';

import { MapToPuissanceTimelineItemProps } from '../mapToPuissanceTimelineItemProps';

export const mapToPuissanceImportéeTimelineItemsProps: MapToPuissanceTimelineItemProps = (
  record,
  unitéPuissance,
  icon,
) => {
  const { importéeLe, puissance } =
    record.payload as Lauréat.Puissance.PuissanceImportéeEvent['payload'];

  return {
    date: importéeLe,
    icon,
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

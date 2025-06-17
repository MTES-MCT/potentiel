import { Lauréat } from '@potentiel-domain/projet';

import { MapToPuissanceTimelineItemProps } from '../mapToPuissanceTimelineItemProps';

export const mapToChangementPuissanceAnnuléTimelineItemProps: MapToPuissanceTimelineItemProps = (
  record,
  _,
  icon,
) => {
  const { annuléLe, annuléPar } =
    record.payload as Lauréat.Puissance.ChangementPuissanceAnnuléEvent['payload'];

  return {
    date: annuléLe,
    icon,
    title: (
      <div>
        Changement de puissance annulé par {<span className="font-semibold">{annuléPar}</span>}
      </div>
    ),
  };
};

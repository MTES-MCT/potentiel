import { Lauréat } from '@potentiel-domain/projet';

import { MapToLauréatTimelineItemProps } from '../mapToLauréatTimelineItemProps';

export const mapToLauréatCahierDesChargesChoisiTimelineItemProps: MapToLauréatTimelineItemProps = (
  modification,
  icon,
) => {
  const { cahierDesCharges, modifiéLe, modifiéPar } =
    modification.payload as Lauréat.CahierDesChargesChoisiEvent['payload'];

  return {
    date: modifiéLe,
    icon,
    title: (
      <div>
        Cahier des charges modifié par {<span className="font-semibold">{modifiéPar}</span>}
      </div>
    ),
    content: (
      <div>
        Nouveau cahier des charges choisi :{' '}
        <span className="font-semibold">{cahierDesCharges}</span>
      </div>
    ),
  };
};

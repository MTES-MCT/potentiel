import { Lauréat } from '@potentiel-domain/projet';

import { MapToAbandonEventTimelineItemProps } from '../mapToAbandonTimelineItemProps';

export const mapToAbandonConfirméTimelineItemProps: MapToAbandonEventTimelineItemProps = (
  abandonConfirmé,
  icon,
) => {
  const { confirméLe, confirméPar } =
    abandonConfirmé.payload as Lauréat.Abandon.AbandonConfirméEvent['payload'];

  return {
    date: confirméLe,
    icon,
    title: (
      <div>
        Demande d'abandon confirmée par {<span className="font-semibold">{confirméPar}</span>}
      </div>
    ),
  };
};

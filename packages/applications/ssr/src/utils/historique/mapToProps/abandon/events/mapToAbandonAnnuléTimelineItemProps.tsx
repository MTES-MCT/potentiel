import { Lauréat } from '@potentiel-domain/projet';

import { MapToEventTimelineItemsProps } from '../../mapToEventTimelineItemsProps.type';

export const mapToAbandonAnnuléTimelineItemProps: MapToEventTimelineItemsProps = (
  abandonAnnulé,
  icon,
) => {
  const { annuléLe, annuléPar } =
    abandonAnnulé.payload as Lauréat.Abandon.AbandonAnnuléEvent['payload'];

  return {
    date: annuléLe,
    icon,
    title: (
      <div>Demande d'abandon annulée par {<span className="font-semibold">{annuléPar}</span>}</div>
    ),
  };
};

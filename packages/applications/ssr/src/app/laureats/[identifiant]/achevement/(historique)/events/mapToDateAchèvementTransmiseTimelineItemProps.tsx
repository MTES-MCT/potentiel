import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDateAchèvementTransmiseTimelineItemProps = (
  event: Lauréat.Achèvement.DateAchèvementTransmiseEvent,
): TimelineItemProps => {
  const { dateAchèvement } = event.payload;

  return {
    date: dateAchèvement,
    title: "Transmission de la date d'achèvement par le co-contractant",
    content: <span className="font-semibold">{<FormattedDate date={dateAchèvement} />}</span>,
  };
};

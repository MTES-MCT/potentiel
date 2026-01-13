import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDateAchèvementTransmiseTimelineItemProps = (
  event: Lauréat.Achèvement.DateAchèvementTransmiseEvent,
): TimelineItemProps => {
  const { dateAchèvement, transmiseLe } = event.payload;

  // aujourd'hui seul le co-contractant peut transmettre la date d'achèvement
  return {
    date: transmiseLe,
    title: "Transmission de la date d'achèvement par le co-contractant",
    details: (
      <div>
        Date d'achèvement :{' '}
        <span className="font-semibold">{<FormattedDate date={dateAchèvement} />}</span>
      </div>
    ),
  };
};

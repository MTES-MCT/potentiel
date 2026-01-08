import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayAuteur } from '../../../../../../components/atoms/demande/DisplayAuteur';
import { Email } from '@potentiel-domain/common';

export const mapToDateAchèvementTransmiseTimelineItemProps = (
  event: Lauréat.Achèvement.DateAchèvementTransmiseEvent,
): TimelineItemProps => {
  const { dateAchèvement, transmisePar } = event.payload;

  return {
    date: dateAchèvement,
    title: (
      <span>
        Transmission de la date d'achèvement
        <DisplayAuteur email={Email.convertirEnValueType(transmisePar)} />
      </span>
    ),
    content: <span className="font-semibold">{<FormattedDate date={dateAchèvement} />}</span>,
  };
};

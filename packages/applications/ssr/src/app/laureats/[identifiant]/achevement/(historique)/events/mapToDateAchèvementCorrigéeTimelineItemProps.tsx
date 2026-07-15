import type { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDateAchèvementCorrigéeTimelineItemProps = (
  event: Lauréat.Achèvement.DateAchèvementCorrigéeEvent,
): TimelineItemProps => {
  const { dateAchèvement, corrigéeLe } = event.payload;
  // aujourd'hui seul le Cocontractant peut corriger la date d'achèvement

  return {
    date: corrigéeLe,
    title: "Correction de la date d'achèvement par le Cocontractant",
    details: (
      <div>
        Nouvelle date d'achèvement réel :{' '}
        <span className="font-semibold">{<FormattedDate date={dateAchèvement} />}</span>
      </div>
    ),
  };
};

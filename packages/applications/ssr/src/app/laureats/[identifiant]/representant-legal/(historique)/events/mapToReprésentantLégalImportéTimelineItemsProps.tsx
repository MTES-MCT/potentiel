import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToReprésentantLégalImportéTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ReprésentantLégalImportéEvent,
): TimelineItemProps => {
  const { importéLe, nomReprésentantLégal } = event.payload;

  return {
    date: importéLe,
    title: (
      <>Représentant légal : {<span className="font-semibold">{nomReprésentantLégal}</span>}</>
    ),
  };
};

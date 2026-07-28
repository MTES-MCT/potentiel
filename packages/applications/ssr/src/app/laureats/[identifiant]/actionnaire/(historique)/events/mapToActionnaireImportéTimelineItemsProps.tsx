import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToActionnaireImportéTimelineItemProps = (
  event: Lauréat.Actionnaire.ActionnaireImportéEvent,
): TimelineItemProps => {
  const { importéLe, actionnaire } = event.payload;

  return {
    date: importéLe,
    title: actionnaire ? (
      <>Candidature : {<span className="font-semibold">{actionnaire}</span>}</>
    ) : (
      'Actionnaire non renseigné à la candidature'
    ),
  };
};

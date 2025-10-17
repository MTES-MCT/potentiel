import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToActionnaireImportéTimelineItemProps = (
  event: Lauréat.Actionnaire.ActionnaireImportéEvent,
): TimelineItemProps => {
  const { importéLe, actionnaire } = event.payload;

  return {
    date: importéLe,
    // actionnaire peut être une string vide
    title: actionnaire ? (
      <>Candidature : {<span className="font-semibold">{actionnaire}</span>}</>
    ) : (
      'Actionnaire non renseigné à la candidature'
    ),
  };
};

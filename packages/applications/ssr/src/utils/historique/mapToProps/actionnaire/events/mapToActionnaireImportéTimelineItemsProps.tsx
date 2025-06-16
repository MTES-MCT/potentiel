import { Actionnaire } from '@potentiel-domain/laureat';

import { MapToActionnaireTimelineItemProps } from '../mapToActionnaireTimelineItemProps';

export const mapToActionnaireImportéTimelineItemProps: MapToActionnaireTimelineItemProps = (
  modification,
  icon,
) => {
  const { importéLe, actionnaire } =
    modification.payload as Actionnaire.ActionnaireImportéEvent['payload'];

  return {
    date: importéLe,
    icon,
    // actionnaire peut être une string vide
    title: actionnaire ? (
      <div>Candidature : {<span className="font-semibold">{actionnaire}</span>}</div>
    ) : (
      <div>Actionnaire non renseigné à la candidature</div>
    ),
  };
};

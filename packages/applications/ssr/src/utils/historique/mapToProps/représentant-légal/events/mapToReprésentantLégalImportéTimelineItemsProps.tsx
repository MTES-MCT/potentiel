import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { MapToReprésentantLégalTimelineItemProps } from '../mapToReprésentantLégalTimelineItemProps';

export const mapToReprésentantLégalImportéTimelineItemProps: MapToReprésentantLégalTimelineItemProps =
  (modification, icon) => {
    const { importéLe, nomReprésentantLégal } =
      modification.payload as ReprésentantLégal.ReprésentantLégalImportéEvent['payload'];

    return {
      date: importéLe,
      icon,
      title: (
        <div>
          Représentant légal : {<span className="font-semibold">{nomReprésentantLégal}</span>}
        </div>
      ),
    };
  };

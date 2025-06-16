import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { MapToReprésentantLégalTimelineItemProps } from '../mapToReprésentantLégalTimelineItemProps';

export const mapToReprésentantLégalModifiéTimelineItemProps: MapToReprésentantLégalTimelineItemProps =
  (modification, icon) => {
    const { modifiéLe, modifiéPar, nomReprésentantLégal, typeReprésentantLégal } =
      modification.payload as ReprésentantLégal.ReprésentantLégalModifiéEvent['payload'];

    return {
      date: modifiéLe,
      icon,
      title: (
        <div>
          Représentant légal modifié par {<span className="font-semibold">{modifiéPar}</span>}
        </div>
      ),
      content: (
        <div className="flex flex-col gap-2">
          <div>
            Type : <span className="font-semibold">{typeReprésentantLégal}</span>
          </div>
          <div>
            Nom : <span className="font-semibold">{nomReprésentantLégal}</span>
          </div>
        </div>
      ),
    };
  };

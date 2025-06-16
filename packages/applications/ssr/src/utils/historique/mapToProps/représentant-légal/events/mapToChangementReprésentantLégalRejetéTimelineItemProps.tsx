import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { MapToReprésentantLégalTimelineItemProps } from '../mapToReprésentantLégalTimelineItemProps';

export const mapToChangementReprésentantLégalRejetéTimelineItemProps: MapToReprésentantLégalTimelineItemProps =
  (changementRejeté, icon) => {
    const { rejetéLe, rejetéPar } =
      changementRejeté.payload as ReprésentantLégal.ChangementReprésentantLégalRejetéEvent['payload'];

    return {
      date: rejetéLe,
      icon,
      title: (
        <div>
          Demande de changement de représentant légal rejetée par{' '}
          {<span className="font-semibold">{rejetéPar}</span>}
        </div>
      ),
    };
  };

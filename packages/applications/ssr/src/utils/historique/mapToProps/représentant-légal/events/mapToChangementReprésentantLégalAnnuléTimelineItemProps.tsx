import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { MapToReprésentantLégalTimelineItemProps } from '../mapToReprésentantLégalTimelineItemProps';

export const mapToChangementReprésentantLégalAnnuléTimelineItemProps: MapToReprésentantLégalTimelineItemProps =
  (changementAnnulé, icon) => {
    const { annuléLe, annuléPar } =
      changementAnnulé.payload as ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent['payload'];

    return {
      date: annuléLe,
      icon,
      title: (
        <div>
          Demande de changement de représentant légal annulée par{' '}
          {<span className="font-semibold">{annuléPar}</span>}
        </div>
      ),
    };
  };

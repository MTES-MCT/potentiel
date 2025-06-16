import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { MapToReprésentantLégalTimelineItemProps } from '../mapToReprésentantLégalTimelineItemProps';

export const mapToChangementReprésentantLégalDemandéTimelineItemProps: MapToReprésentantLégalTimelineItemProps =
  (demandeChangement, icon) => {
    const { demandéLe, demandéPar, typeReprésentantLégal, nomReprésentantLégal } =
      demandeChangement.payload as ReprésentantLégal.ChangementReprésentantLégalDemandéEvent['payload'];

    return {
      date: demandéLe,
      icon,
      title: (
        <div>
          Demande de changement de représentant légal demandée par{' '}
          {<span className="font-semibold">{demandéPar}</span>}
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

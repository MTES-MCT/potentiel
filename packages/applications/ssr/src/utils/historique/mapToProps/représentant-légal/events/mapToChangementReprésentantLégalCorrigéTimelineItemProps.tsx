import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { MapToReprésentantLégalTimelineItemProps } from '../mapToReprésentantLégalTimelineItemProps';

export const mapToChangementReprésentantLégalCorrigéTimelineItemProps: MapToReprésentantLégalTimelineItemProps =
  (demandeChangement, icon) => {
    const { corrigéLe, corrigéPar, typeReprésentantLégal, nomReprésentantLégal } =
      demandeChangement.payload as ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent['payload'];

    return {
      date: corrigéLe,
      icon,
      title: (
        <div>
          Demande de changement de représentant légal corrigée par{' '}
          {<span className="font-semibold">{corrigéPar}</span>}
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

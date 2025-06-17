import { DateTime } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/laureat';

import { MapToRaccordementTimelineItemProps } from '../../mapToRaccordementTimelineItemProps';

export const mapToDossierRacordementSuppriméTimelineItemProps: MapToRaccordementTimelineItemProps =
  (modification, icon) => {
    const { référenceDossier } =
      modification.payload as Raccordement.DossierDuRaccordementSuppriméEvent['payload'];

    return {
      date: modification.createdAt as DateTime.RawType,
      icon,
      title: (
        <div>
          Le dossier de raccordement ayant comme référence{' '}
          <span className="font-semibold">{référenceDossier}</span> a été supprimé.
        </div>
      ),
    };
  };

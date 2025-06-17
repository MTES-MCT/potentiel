import { DateTime } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/laureat';

import { MapToRaccordementTimelineItemProps } from '../../../mapToRaccordementTimelineItemProps';

export const mapToAccuséRéceptionDemandeComplèteRaccordementTransmisTimelineItemProps: MapToRaccordementTimelineItemProps =
  (modification, icon) => {
    const { référenceDossierRaccordement } =
      modification.payload as Raccordement.AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1['payload'];

    return {
      date: modification.createdAt as DateTime.RawType,
      icon,
      title: (
        <div>
          L'accusé de réception de la complète de raccordement a été transmis pour le dossier
          <span className="font-semibold">{référenceDossierRaccordement}</span>.
        </div>
      ),
    };
  };

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeComplèteRaccordementModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV1
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV2
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEvent
  ) & { createdAt: string },
): TimelineItemProps => ({
  date: event.createdAt as DateTime.RawType,
  title: (
    <>
      Le dossier avec la référence{' '}
      <span className="font-semibold">
        {event.type === 'DemandeComplèteRaccordementModifiée-V1'
          ? event.payload.referenceActuelle
          : event.payload.référenceDossierRaccordement}
      </span>{' '}
      a été modifié
    </>
  ),
});

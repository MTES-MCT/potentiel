import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

export const mapToDemandeComplèteRaccordementModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV1
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV2
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEvent
  ) & { createdAt: string },
) => {
  return {
    date: event.createdAt as DateTime.RawType,
    title: (
      <div>
        Le dossier avec la référence{' '}
        <span className="font-semibold">
          {event.type === 'DemandeComplèteRaccordementModifiée-V1'
            ? event.payload.referenceActuelle
            : event.payload.référenceDossierRaccordement}
        </span>{' '}
        a été modifié
      </div>
    ),
  };
};

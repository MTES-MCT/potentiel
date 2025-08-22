import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

export const mapToRéférenceDossierRacordementModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.RéférenceDossierRacordementModifiéeEventV1
    | Lauréat.Raccordement.RéférenceDossierRacordementModifiéeEvent
  ) & {
    createdAt: string;
  },
) => {
  return {
    date:
      event.type === 'RéférenceDossierRacordementModifiée-V2'
        ? event.payload.modifiéeLe
        : (event.createdAt as DateTime.RawType),
    title: (
      <div>
        La référence pour le dossier de raccordement{' '}
        <span className="font-semibold">{event.payload.référenceDossierRaccordementActuelle}</span>{' '}
        a été changée
        {event.type === 'RéférenceDossierRacordementModifiée-V2' &&
          ` par ${event.payload.modifiéePar}`}
      </div>
    ),
    content: (
      <div>
        Nouvelle référence :{' '}
        <span className="font-semibold">{event.payload.nouvelleRéférenceDossierRaccordement}</span>
      </div>
    ),
  };
};

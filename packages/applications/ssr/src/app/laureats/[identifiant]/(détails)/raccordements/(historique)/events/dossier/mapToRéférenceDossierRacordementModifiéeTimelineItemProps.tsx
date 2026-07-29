import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRéférenceDossierRacordementModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.RéférenceDossierRacordementModifiéeEventV1
    | Lauréat.Raccordement.RéférenceDossierRacordementModifiéeEvent
  ) & {
    createdAt: string;
  },
): TimelineItemProps => ({
  date:
    event.type === 'RéférenceDossierRacordementModifiée-V2'
      ? event.payload.modifiéeLe
      : (event.createdAt as DateTime.RawType),
  title: 'Référence du dossier de raccordement modifiée',
  actor:
    event.type === 'RéférenceDossierRacordementModifiée-V2' ? event.payload.modifiéePar : undefined,
  details: (
    <div className="flex flex-col">
      <span>
        Ancienne référence :{' '}
        <span className="font-semibold">{event.payload.référenceDossierRaccordementActuelle}</span>
      </span>
      <span>
        Nouvelle référence :{' '}
        <span className="font-semibold">{event.payload.nouvelleRéférenceDossierRaccordement}</span>
      </span>
    </div>
  ),
});

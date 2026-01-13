import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/timeline';

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
  title: (
    <div>
      La référence pour le dossier de raccordement{' '}
      <span className="font-semibold">{event.payload.référenceDossierRaccordementActuelle}</span> a
      été changée
    </div>
  ),
  actor:
    event.type === 'RéférenceDossierRacordementModifiée-V2' ? event.payload.modifiéePar : undefined,
  details: (
    <div>
      Nouvelle référence :{' '}
      <span className="font-semibold">{event.payload.nouvelleRéférenceDossierRaccordement}</span>
    </div>
  ),
});

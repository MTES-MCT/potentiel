import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDateMiseEnServiceModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DateMiseEnServiceModifiéeEvent
    | Lauréat.Raccordement.DateMiseEnServiceModifiéeEventV1
  ) & {
    createdAt: string;
  },
): TimelineItemProps => {
  const { référenceDossierRaccordement, dateMiseEnService } = event.payload;

  const modifiéeLe: DateTime.RawType =
    'modifiéeLe' in event.payload
      ? event.payload.modifiéeLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const modifiéePar: string | undefined =
    'modifiéePar' in event.payload ? event.payload.modifiéePar : undefined;

  return {
    date: modifiéeLe,
    actor: modifiéePar,
    title: 'Date de mise en service modifiée',
    details: (
      <div className="flex flex-col">
        <span>
          Référence du dossier :{' '}
          <span className="font-semibold">{référenceDossierRaccordement}</span>
        </span>
        <span>
          Date de mise en service :{' '}
          <FormattedDate className="font-semibold" date={dateMiseEnService} />
        </span>
      </div>
    ),
  };
};

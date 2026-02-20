import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

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
    title: (
      <div>
        La date de mise en service du dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span> a été modifiée
      </div>
    ),
    details: (
      <span>
        Date de mise en service :{' '}
        <FormattedDate className="font-semibold" date={dateMiseEnService} />
      </span>
    ),
  };
};

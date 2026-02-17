import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToDateMiseEnServiceTransmiseTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DateMiseEnServiceTransmiseEvent
    | Lauréat.Raccordement.DateMiseEnServiceTransmiseV1Event
  ) & {
    createdAt: string;
  },
): TimelineItemProps => {
  const { référenceDossierRaccordement, dateMiseEnService } = event.payload;

  const transmiseLe: DateTime.RawType =
    'transmiseLe' in event.payload
      ? event.payload.transmiseLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const transmisePar: string | undefined =
    'transmisePar' in event.payload ? event.payload.transmisePar : undefined;

  return {
    date: transmiseLe,
    actor: transmisePar,
    title: (
      <div>
        La date de mise en service du dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span> a été transmise
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

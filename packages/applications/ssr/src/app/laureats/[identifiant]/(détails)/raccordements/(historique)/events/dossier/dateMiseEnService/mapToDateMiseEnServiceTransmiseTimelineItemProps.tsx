import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import type { TimelineItemProps } from '@/components/organisms/timeline';

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
    title: 'Date de mise en service transmise',
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

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { FormattedDate } from '../../../../../../../../components/atoms/FormattedDate';

export const mapToDateMiseEnServiceTransmiseTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DateMiseEnServiceTransmiseEvent
    | Lauréat.Raccordement.DateMiseEnServiceTransmiseV1Event
  ) & {
    createdAt: string;
  },
): TimelineItemProps => {
  const { référenceDossierRaccordement, dateMiseEnService } = event.payload;

  return {
    date: event.createdAt as DateTime.RawType,
    title: (
      <div>
        La date de mise en service a été transmise pour le dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>
      </div>
    ),
    content: (
      <span>
        Date de mise en service :{' '}
        <FormattedDate className="font-semibold" date={dateMiseEnService} />
      </span>
    ),
  };
};

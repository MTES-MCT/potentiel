import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToDateMiseEnServiceModifiéeTimelineItemProps = (
  event: Lauréat.Raccordement.DateMiseEnServiceModifiéeEvent & {
    createdAt: string;
  },
): TimelineItemProps => {
  const { référenceDossierRaccordement, dateMiseEnService } = event.payload;

  return {
    date: event.createdAt as DateTime.RawType,
    actor: event.payload.modifiéePar,
    title: (
      <div>
        La date de mise en service pour le dossier de raccordement{' '}
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

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToDateMiseEnServiceModifiéeTimelineItemProps = (
  event: Lauréat.Raccordement.DateMiseEnServiceModifiéeEvent,
): TimelineItemProps => {
  const { référenceDossierRaccordement, dateMiseEnService } = event.payload;

  return {
    date: event.payload.modifiéeLe,
    actor: event.payload.modifiéePar,
    title: (
      <div>
        La date de mise en service a été <span className="font-semibold">modifiée</span> pour le
        dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>
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

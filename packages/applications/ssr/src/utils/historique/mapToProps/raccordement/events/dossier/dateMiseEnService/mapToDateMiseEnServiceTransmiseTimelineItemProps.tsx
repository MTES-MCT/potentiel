import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

export const mapToDateMiseEnServiceTransmiseTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DateMiseEnServiceTransmiseEvent
    | Lauréat.Raccordement.DateMiseEnServiceTransmiseV1Event
  ) & {
    createdAt: string;
  },
) => {
  const { référenceDossierRaccordement } = event.payload;

  return {
    date: event.createdAt as DateTime.RawType,
    title: (
      <div>
        La date de mise en service a été tranmise pour le dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>
      </div>
    ),
  };
};

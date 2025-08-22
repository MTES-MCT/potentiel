import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

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

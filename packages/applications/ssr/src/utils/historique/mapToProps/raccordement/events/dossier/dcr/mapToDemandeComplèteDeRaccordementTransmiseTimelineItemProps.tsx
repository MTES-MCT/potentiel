import type { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeComplèteDeRaccordementTransmiseTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV1
    | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV2
    | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEvent
  ) & {
    createdAt: string;
  },
) => {
  const { référenceDossierRaccordement, dateQualification } = event.payload;

  return {
    date: dateQualification ?? (event.createdAt as DateTime.RawType),
    title: (
      <div>
        Un nouveau dossier de raccordement a été créé avec comme référence{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>
      </div>
    ),
  };
};

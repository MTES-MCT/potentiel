import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToDemandeComplèteDeRaccordementTransmiseTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV1
    | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV2
    | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEvent
  ) & {
    createdAt: string;
  },
): TimelineItemProps => {
  const { référenceDossierRaccordement, dateQualification } = event.payload;

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
      <>
        Un nouveau dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span> a été créé
      </>
    ),
    details: dateQualification && (
      <span>
        Date de l'accusé de réception :{' '}
        <FormattedDate className="font-semibold" date={dateQualification} />
      </span>
    ),
  };
};

import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeComplèteRaccordementModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV1
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV2
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV3
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEvent
  ) & { createdAt: string },
): TimelineItemProps => {
  const { dateQualification } = event.payload;
  const transmiseLe: DateTime.RawType =
    'modifiéeLe' in event.payload
      ? event.payload.modifiéeLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const transmisePar: string | undefined =
    'modifiéePar' in event.payload ? event.payload.modifiéePar : undefined;

  const référenceDossier =
    event.type === 'DemandeComplèteRaccordementModifiée-V1'
      ? event.payload.referenceActuelle
      : event.payload.référenceDossierRaccordement;

  return {
    date: transmiseLe,
    actor: transmisePar,
    title: (
      <>
        Le dossier <span className="font-semibold">{référenceDossier}</span> a été modifié
      </>
    ),
    details: (
      <span>
        Date de l'accusé de réception :{' '}
        <FormattedDate className="font-semibold" date={dateQualification} />
      </span>
    ),
  };
};

import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDocumentModifiéTimelineItemProps = (
  event: Lauréat.Raccordement.DocumentRaccordementModifiéEventV1,
): TimelineItemProps => {
  return {
    date: DateTime.convertirEnValueType(event.payload.modifiéLe).formatter(),
    actor: event.payload.modifiéPar,
    title: (
      <>
        La {event.payload.type.split('-').join(' ')} du dossier de raccordement{' '}
        <span className="font-semibold">{event.payload.référenceDossierRaccordement}</span> a été
        modifiée
      </>
    ),
  };
};

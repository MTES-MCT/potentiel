import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDocumentTransmisTimelineItemProps = (
  event: Lauréat.Raccordement.DocumentRaccordementTransmisEventV1,
): TimelineItemProps => {
  return {
    date: DateTime.convertirEnValueType(event.payload.transmisLe).formatter(),
    actor: event.payload.transmisPar,
    title: (
      <>
        La {event.payload.type.split('-').join(' ')} du dossier de raccordement{' '}
        <span className="font-semibold">{event.payload.référenceDossierRaccordement}</span> a été
        transmise
      </>
    ),
  };
};

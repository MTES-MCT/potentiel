import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDocumentSuppriméTimelineItemProps = (
  event: Lauréat.Raccordement.DocumentRaccordementSuppriméEventV1,
): TimelineItemProps => {
  return {
    date: DateTime.convertirEnValueType(event.payload.suppriméLe).formatter(),
    actor: event.payload.suppriméPar,
    title: (
      <>
        La {event.payload.type.split('-').join(' ')} du dossier de raccordement{' '}
        <span className="font-semibold">{event.payload.référenceDossierRaccordement}</span> a été
        supprimée
      </>
    ),
  };
};

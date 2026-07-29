import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDocumentSuppriméTimelineItemProps = (
  event: Lauréat.Raccordement.DocumentRaccordementSuppriméEventV1,
): TimelineItemProps => {
  const { type: rawType, référenceDossierRaccordement } = event.payload;
  const type = rawType.split('-').join(' ');

  return {
    date: DateTime.convertirEnValueType(event.payload.suppriméLe).formatter(),
    actor: event.payload.suppriméPar,
    title: (
      <>
        <span className="first-letter:capitalize">{type}</span> supprimée
      </>
    ),
    details: (
      <span>
        Référence du dossier : <span className="font-semibold">{référenceDossierRaccordement}</span>
      </span>
    ),
  };
};

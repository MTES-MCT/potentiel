import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDossierRaccordementSuppriméTimelineItemProps = (
  event: Lauréat.Raccordement.DossierDuRaccordementSuppriméEvent & { createdAt: string },
): TimelineItemProps => {
  const { référenceDossier } = event.payload;

  return {
    date: event.createdAt as DateTime.RawType,
    title: (
      <>
        Le dossier de raccordement ayant comme référence{' '}
        <span className="font-semibold">{référenceDossier}</span> a été supprimé
      </>
    ),
  };
};

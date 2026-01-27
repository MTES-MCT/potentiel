import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDossierRaccordementSuppriméTimelineItemProps = (
  event:
    | Lauréat.Raccordement.DossierDuRaccordementSuppriméEvent
    | (Lauréat.Raccordement.DossierDuRaccordementSuppriméEventV1 & { createdAt: string }),
): TimelineItemProps => {
  const { référenceDossier } = event.payload;

  const date =
    event.type === 'DossierDuRaccordementSupprimé-V2'
      ? event.payload.suppriméLe
      : (event.createdAt as DateTime.RawType);

  const actor =
    event.type === 'DossierDuRaccordementSupprimé-V2' ? event.payload.suppriméPar : undefined;

  return {
    date,
    actor,
    title: (
      <>
        Le dossier de raccordement ayant comme référence{' '}
        <span className="font-semibold">{référenceDossier}</span> a été supprimé
      </>
    ),
  };
};

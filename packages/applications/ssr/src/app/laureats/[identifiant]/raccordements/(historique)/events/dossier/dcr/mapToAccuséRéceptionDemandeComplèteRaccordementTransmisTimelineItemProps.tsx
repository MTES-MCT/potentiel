import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAccuséRéceptionDemandeComplèteRaccordementTransmisTimelineItemProps = (
  event: Lauréat.Raccordement.AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1 & {
    createdAt: string;
  },
): TimelineItemProps => {
  const { référenceDossierRaccordement } = event.payload;

  return {
    date: event.createdAt as DateTime.RawType,
    title: (
      <>
        L'accusé de réception de la complète de raccordement a été transmis pour le dossier{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>.
      </>
    ),
  };
};

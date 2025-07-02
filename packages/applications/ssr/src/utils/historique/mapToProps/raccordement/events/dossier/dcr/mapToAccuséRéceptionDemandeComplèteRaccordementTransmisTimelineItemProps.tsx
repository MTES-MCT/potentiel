import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Raccordement } from '@potentiel-domain/projet';

export const mapToAccuséRéceptionDemandeComplèteRaccordementTransmisTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { référenceDossierRaccordement } =
    modification.payload as Raccordement.AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1['payload'];

  return {
    date: modification.createdAt as DateTime.RawType,
    title: (
      <div>
        L'accusé de réception de la complète de raccordement a été transmis pour le dossier{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span>.
      </div>
    ),
  };
};

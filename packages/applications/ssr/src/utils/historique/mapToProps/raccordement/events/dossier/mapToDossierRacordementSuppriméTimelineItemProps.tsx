import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Raccordement } from '@potentiel-domain/projet';

export const mapToDossierRacordementSuppriméTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { référenceDossier } =
    modification.payload as Raccordement.DossierDuRaccordementSuppriméEvent['payload'];

  return {
    date: modification.createdAt as DateTime.RawType,
    title: (
      <div>
        Le dossier de raccordement ayant comme référence{' '}
        <span className="font-semibold">{référenceDossier}</span> a été supprimé.
      </div>
    ),
  };
};

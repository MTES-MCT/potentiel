import { DateTime } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';
import { Raccordement } from '@potentiel-domain/laureat';

export const mapToDossierRacordementSuppriméTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { référenceDossier } =
    modification.payload as Raccordement.DossierDuRaccordementSuppriméEvent['payload'];

  return {
    date: modification.createdAt as DateTime.RawType,
    title: (
      <div>
        Le dossier de raccordement ayant comme référence
        <span className="font-semibold">{référenceDossier}</span>a été supprimé.
      </div>
    ),
  };
};

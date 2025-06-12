import { Historique } from '@potentiel-domain/historique';
import { Raccordement } from '@potentiel-domain/laureat';

export const mapToDossierRacordementSuppriméTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { suppriméeLe, suppriméePar, référenceDossierRaccordement } =
    modification.payload as Raccordement.DateMiseEnServiceSuppriméeEvent['payload'];

  return {
    date: suppriméeLe,
    title: (
      <div>
        La date de mise en service du dossier de raccordement ayant comme référence
        <span className="font-semibold">{référenceDossierRaccordement}</span>a été supprimée par{' '}
        <span className="font-semiboold">{suppriméePar}</span>.
      </div>
    ),
  };
};

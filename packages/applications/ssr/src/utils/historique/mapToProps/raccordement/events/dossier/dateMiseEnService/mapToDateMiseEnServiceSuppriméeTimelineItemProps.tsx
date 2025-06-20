import { Lauréat } from '@potentiel-domain/projet';
import { Raccordement } from '@potentiel-domain/projet';

export const mapToDossierRacordementSuppriméTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
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

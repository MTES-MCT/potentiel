import { Lauréat } from '@potentiel-domain/projet';
export const mapToDossierRacordementSuppriméTimelineItemProps = (
  modification: Lauréat.Raccordement.DateMiseEnServiceSuppriméeEvent,
) => {
  const { suppriméeLe, suppriméePar, référenceDossierRaccordement } = modification.payload;

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

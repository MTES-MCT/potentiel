import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
export const mapToDossierRacordementSuppriméTimelineItemProps = (
  event: Lauréat.Raccordement.DateMiseEnServiceSuppriméeEvent,
): TimelineItemProps => {
  const { suppriméeLe, suppriméePar, référenceDossierRaccordement } = event.payload;

  return {
    date: suppriméeLe,
    title: (
      <>
        La date de mise en service du dossier de raccordement ayant comme référence
        <span className="font-semibold">{référenceDossierRaccordement}</span>a été supprimée
      </>
    ),
    acteur: suppriméePar,
  };
};

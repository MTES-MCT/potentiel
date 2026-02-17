import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
export const mapToDossierRacordementSuppriméTimelineItemProps = (
  event: Lauréat.Raccordement.DateMiseEnServiceSuppriméeEvent,
): TimelineItemProps => {
  const { suppriméeLe, suppriméePar, référenceDossierRaccordement } = event.payload;

  return {
    date: suppriméeLe,
    actor: suppriméePar,
    title: (
      <>
        La date de mise en service du dossier de raccordement{' '}
        <span className="font-semibold">{référenceDossierRaccordement}</span> a été supprimée
      </>
    ),
  };
};

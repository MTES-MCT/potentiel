import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
export const mapToDateMiseEnServiceSuppriméeTimelineItemProps = (
  event: Lauréat.Raccordement.DateMiseEnServiceSuppriméeEvent,
): TimelineItemProps => {
  const { suppriméeLe, suppriméePar, référenceDossierRaccordement } = event.payload;

  return {
    date: suppriméeLe,
    actor: suppriméePar,
    title: 'Date de mise en service supprimée',
    details: (
      <span>
        Référence du dossier : <span className="font-semibold">{référenceDossierRaccordement}</span>
      </span>
    ),
  };
};

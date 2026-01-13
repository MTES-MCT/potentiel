import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalRejetéTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent,
): TimelineItemProps => {
  const { rejetéLe, rejetéPar, rejetAutomatique } = event.payload;

  return {
    date: rejetéLe,
    title: rejetAutomatique
      ? 'Demande de changement de représentant légal rejetée par le préfet de la région du projet'
      : 'Demande de changement de représentant légal rejetée',
    actor: rejetAutomatique ? undefined : rejetéPar,
  };
};

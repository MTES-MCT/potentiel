import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalRejetéTimelineItemProps = (
  changementRejeté: Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent,
) => {
  const { rejetéLe, rejetéPar, rejetAutomatique } = changementRejeté.payload;

  return {
    date: rejetéLe,
    title: (
      <div>
        Demande de changement de représentant légal rejetée{' '}
        {rejetAutomatique ? (
          `par le préfet de la région du projet`
        ) : (
          <TimelineItemUserEmail email={rejetéPar} />
        )}
      </div>
    ),
  };
};

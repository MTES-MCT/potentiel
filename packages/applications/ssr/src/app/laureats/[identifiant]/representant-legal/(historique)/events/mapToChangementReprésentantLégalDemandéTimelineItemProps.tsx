import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalDemandéTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent,
): TimelineItemProps => {
  const { demandéLe, demandéPar, typeReprésentantLégal, nomReprésentantLégal } = event.payload;

  return {
    date: demandéLe,
    title: 'Demande de changement de représentant légal demandée',
    acteur: demandéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Type : <span className="font-semibold">{typeReprésentantLégal}</span>
        </div>
        <div>
          Nom : <span className="font-semibold">{nomReprésentantLégal}</span>
        </div>
      </div>
    ),
  };
};

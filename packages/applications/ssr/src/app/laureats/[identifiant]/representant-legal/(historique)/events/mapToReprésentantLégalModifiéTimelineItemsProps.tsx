import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToReprésentantLégalModifiéTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ReprésentantLégalModifiéEvent,
): TimelineItemProps => {
  const { modifiéLe, modifiéPar, nomReprésentantLégal, typeReprésentantLégal } = event.payload;

  return {
    date: modifiéLe,
    title: 'Représentant légal modifié',
    acteur: modifiéPar,
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

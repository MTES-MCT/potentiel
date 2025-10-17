import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalEnregistréTimelineItemProps = (
  event: Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, nomReprésentantLégal, typeReprésentantLégal } =
    event.payload;

  return {
    date: enregistréLe,
    title: 'Représentant légal modifié',
    acteur: enregistréPar,
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

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalEnregistréTimelineItemProps = (
  changement: Lauréat.ReprésentantLégal.ChangementReprésentantLégalEnregistréEvent,
) => {
  const { enregistréLe, enregistréPar, nomReprésentantLégal, typeReprésentantLégal } =
    changement.payload;

  return {
    date: enregistréLe,
    title: (
      <div>
        Représentant légal modifié <TimelineItemUserEmail email={enregistréPar} />
      </div>
    ),
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

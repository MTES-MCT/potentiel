import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalDemandéTimelineItemProps = (
  demandeChangement: Lauréat.ReprésentantLégal.ChangementReprésentantLégalDemandéEvent,
) => {
  const { demandéLe, demandéPar, typeReprésentantLégal, nomReprésentantLégal } =
    demandeChangement.payload;

  return {
    date: demandéLe,
    title: (
      <div>
        Demande de changement de représentant légal demandée{' '}
        <TimelineItemUserEmail email={demandéPar} />
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

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToChangementReprésentantLégalAccordéTimelineItemProps = (
  changementAccordé: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent,
) => {
  const { accordéLe, accordéPar, nomReprésentantLégal, typeReprésentantLégal, accordAutomatique } =
    changementAccordé.payload;

  return {
    date: accordéLe,
    title: (
      <div>
        Demande de changement de représentant légal accordée{' '}
        {accordAutomatique ? (
          `par le préfet de la région du projet`
        ) : (
          <TimelineItemUserEmail email={accordéPar} />
        )}
        {<span className="font-semibold">{accordéPar}</span>}
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

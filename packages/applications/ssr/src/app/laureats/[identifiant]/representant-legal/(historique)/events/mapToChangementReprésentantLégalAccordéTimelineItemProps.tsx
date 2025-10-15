import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementReprésentantLégalAccordéTimelineItemProps = (
  changementAccordé: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAccordéEvent,
) => {
  const { accordéLe, accordéPar, nomReprésentantLégal, typeReprésentantLégal } =
    changementAccordé.payload;

  return {
    date: accordéLe,
    title: (
      <div>
        Demande de changement de représentant légal accordée par{' '}
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

import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementReprésentantLégalRejetéTimelineItemProps = (
  changementRejeté: Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent,
) => {
  const { rejetéLe, rejetéPar } = changementRejeté.payload;

  return {
    date: rejetéLe,
    title: (
      <div>
        Demande de changement de représentant légal rejetée par{' '}
        {<span className="font-semibold">{rejetéPar}</span>}
      </div>
    ),
  };
};

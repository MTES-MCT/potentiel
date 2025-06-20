import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementReprésentantLégalRejetéTimelineItemProps = (
  changementRejeté: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { rejetéLe, rejetéPar } =
    changementRejeté.payload as Lauréat.ReprésentantLégal.ChangementReprésentantLégalRejetéEvent['payload'];

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

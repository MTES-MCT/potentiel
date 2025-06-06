import { Historique } from '@potentiel-domain/historique';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

export const mapToChangementReprésentantLégalRejetéTimelineItemProps = (
  changementRejeté: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { rejetéLe, rejetéPar } =
    changementRejeté.payload as ReprésentantLégal.ChangementReprésentantLégalRejetéEvent['payload'];

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

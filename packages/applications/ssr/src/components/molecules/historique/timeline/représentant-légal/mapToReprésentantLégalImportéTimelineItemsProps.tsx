import { Historique } from '@potentiel-domain/historique';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

export const mapToReprésentantLégalImportéTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { importéLe, nomReprésentantLégal } =
    modification.payload as ReprésentantLégal.ReprésentantLégalImportéEvent['payload'];

  return {
    date: importéLe,
    title: (
      <div>
        Représentant légal : {<span className="font-semibold">{nomReprésentantLégal}</span>}
      </div>
    ),
  };
};

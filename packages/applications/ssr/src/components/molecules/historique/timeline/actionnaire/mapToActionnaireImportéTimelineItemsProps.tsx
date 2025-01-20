import { Historique } from '@potentiel-domain/historique';
import { Actionnaire } from '@potentiel-domain/laureat';

export const mapToActionnaireImportéTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    payload: { importéLe, actionnaire },
  } = modification.payload as Actionnaire.ActionnaireImportéEvent;

  return {
    date: importéLe,
    title: (
      <div>
        Valeur de l'actionnaire à l'import : {<span className="font-semibold">{actionnaire}</span>}
      </div>
    ),
  };
};

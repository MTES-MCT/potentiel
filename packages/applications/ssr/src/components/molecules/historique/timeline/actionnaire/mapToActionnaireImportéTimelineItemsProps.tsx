import { Historique } from '@potentiel-domain/historique';
import { Actionnaire } from '@potentiel-domain/laureat';

export const mapToActionnaireImportéTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { importéLe, actionnaire } =
    modification.payload as Actionnaire.ActionnaireImportéEvent['payload'];

  return {
    date: importéLe,
    title: (
      <div>
        Valeur de l'actionnaire à l'import : {<span className="font-semibold">{actionnaire}</span>}
      </div>
    ),
  };
};

import { Historique } from '@potentiel-domain/historique';
import { Actionnaire } from '@potentiel-domain/laureat';

export const mapToActionnaireImportéTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { importéLe, actionnaire } =
    modification.payload as Actionnaire.ActionnaireImportéEvent['payload'];

  return {
    date: importéLe,
    // actionnaire peut être une string vide
    title: actionnaire ? (
      <div>Candidature : {<span className="font-semibold">{actionnaire}</span>}</div>
    ) : (
      <div>Actionnaire non renseigné à la candidature</div>
    ),
  };
};

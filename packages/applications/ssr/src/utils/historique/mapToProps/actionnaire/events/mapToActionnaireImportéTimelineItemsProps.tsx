import { Lauréat } from '@potentiel-domain/projet';

export const mapToActionnaireImportéTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { importéLe, actionnaire } =
    modification.payload as Lauréat.Actionnaire.ActionnaireImportéEvent['payload'];

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

import { Historique } from '@potentiel-domain/historique';
import { Puissance } from '@potentiel-domain/laureat';

export const mapToPuissanceImportéeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { importéeLe, puissance } =
    modification.payload as Puissance.PuissanceImportéeEvent['payload'];

  return {
    date: importéeLe,
    title: <div>Candidature : {<span className="font-semibold">{puissance} MW</span>}</div>,
  };
};

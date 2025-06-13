import { Lauréat } from '@potentiel-domain/projet';
import { Historique } from '@potentiel-domain/historique';

export const mapToPuissanceImportéeTimelineItemsProps = (
  record: Historique.HistoriquePuissanceProjetListItemReadModel,
  unitéPuissance: string,
) => {
  const { importéeLe, puissance } =
    record.payload as Lauréat.Puissance.PuissanceImportéeEvent['payload'];

  return {
    date: importéeLe,
    title: (
      <div>
        Candidature :{' '}
        {
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        }
      </div>
    ),
  };
};

import { Lauréat } from '@potentiel-domain/projet';

export const mapToPuissanceImportéeTimelineItemsProps = (
  record: Lauréat.Puissance.HistoriquePuissanceProjetListItemReadModel,
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

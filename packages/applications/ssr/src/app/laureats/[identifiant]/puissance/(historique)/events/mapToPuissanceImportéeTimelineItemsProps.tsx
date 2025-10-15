import { Lauréat } from '@potentiel-domain/projet';

export const mapToPuissanceImportéeTimelineItemsProps = (
  record: Lauréat.Puissance.PuissanceImportéeEvent,
  unitéPuissance: string,
) => {
  const { importéeLe, puissance } = record.payload;

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

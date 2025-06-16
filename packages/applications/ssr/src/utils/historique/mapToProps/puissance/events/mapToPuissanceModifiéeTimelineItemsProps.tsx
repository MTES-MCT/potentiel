import { Lauréat } from '@potentiel-domain/projet';

export const mapToPuissanceModifiéeTimelineItemsProps = (
  record: Lauréat.Puissance.HistoriquePuissanceProjetListItemReadModel,
  unitéPuissance: string,
) => {
  const { modifiéeLe, modifiéePar, puissance, raison } =
    record.payload as Lauréat.Puissance.PuissanceModifiéeEvent['payload'];

  return {
    date: modifiéeLe,
    title: <div>Puissance modifiée par {<span className="font-semibold">{modifiéePar}</span>}</div>,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        </div>
        {raison && (
          <div>
            Raison : <span className="font-semibold">{raison}</span>
          </div>
        )}
      </div>
    ),
  };
};

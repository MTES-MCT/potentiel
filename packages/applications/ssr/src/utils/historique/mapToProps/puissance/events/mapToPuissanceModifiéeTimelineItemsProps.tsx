import { Lauréat } from '@potentiel-domain/projet';
import { Historique } from '@potentiel-domain/historique';

export const mapToPuissanceModifiéeTimelineItemsProps = (
  record: Historique.HistoriquePuissanceProjetListItemReadModel,
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

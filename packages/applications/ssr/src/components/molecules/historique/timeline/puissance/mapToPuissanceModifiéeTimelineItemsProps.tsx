import { Historique } from '@potentiel-domain/historique';
import { Puissance } from '@potentiel-domain/laureat';

export const mapToPuissanceModifiéeTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { modifiéeLe, modifiéePar, puissance, raison } =
    modification.payload as Puissance.PuissanceModifiéeEvent['payload'];

  return {
    date: modifiéeLe,
    title: <div>Puissance modifiée par {<span className="font-semibold">{modifiéePar}</span>}</div>,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance : <span className="font-semibold">{puissance} MW</span>
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

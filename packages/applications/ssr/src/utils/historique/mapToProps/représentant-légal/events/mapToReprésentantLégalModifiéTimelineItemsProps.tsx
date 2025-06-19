import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToReprésentantLégalModifiéTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { modifiéLe, modifiéPar, nomReprésentantLégal, typeReprésentantLégal } =
    modification.payload as Lauréat.ReprésentantLégal.ReprésentantLégalModifiéEvent['payload'];

  return {
    date: modifiéLe,
    title: (
      <div>
        Représentant légal modifié par {<span className="font-semibold">{modifiéPar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Type : <span className="font-semibold">{typeReprésentantLégal}</span>
        </div>
        <div>
          Nom : <span className="font-semibold">{nomReprésentantLégal}</span>
        </div>
      </div>
    ),
  };
};

import { Historique } from '@potentiel-domain/historique';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

export const mapToModificationReprésentantLégalTimelineItemProps = (
  modificationReprésentantLégal: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { modifiéLe, modifiéPar, nomReprésentantLégal, typeReprésentantLégal } =
    modificationReprésentantLégal.payload as ReprésentantLégal.ReprésentantLégalModifiéEvent['payload'];

  return {
    date: modifiéLe,
    title: (
      <div>
        Modification par <span className="font-semibold">{modifiéPar}</span>
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

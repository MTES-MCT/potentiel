import { Historique } from '@potentiel-domain/historique';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

export const mapToChangementReprésentantLégalDemandéTimelineItemProps = (
  demandeChangement: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { demandéLe, demandéPar, typeReprésentantLégal, nomReprésentantLégal } =
    demandeChangement.payload as ReprésentantLégal.ChangementReprésentantLégalDemandéEvent['payload'];

  return {
    date: demandéLe,
    title: (
      <div>
        Demande de changement de représentant légal demandée par{' '}
        {<span className="font-semibold">{demandéPar}</span>}
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

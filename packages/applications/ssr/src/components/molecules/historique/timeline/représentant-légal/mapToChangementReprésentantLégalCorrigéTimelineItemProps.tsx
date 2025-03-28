import { Historique } from '@potentiel-domain/historique';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

export const mapToChangementReprésentantLégalCorrigéTimelineItemProps = (
  demandeChangement: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { corrigéLe, corrigéPar, typeReprésentantLégal, nomReprésentantLégal } =
    demandeChangement.payload as ReprésentantLégal.ChangementReprésentantLégalCorrigéEvent['payload'];

  return {
    date: corrigéLe,
    title: (
      <div>
        Changement de représentant légal corrigé par{' '}
        {<span className="font-semibold">{corrigéPar}</span>}
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

import { Historique } from '@potentiel-domain/historique';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

export const mapToChangementReprésentantLégalAnnuléTimelineItemProps = (
  changementAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } =
    changementAnnulé.payload as ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: (
      <div>
        Changement de représentant légal annulé par{' '}
        {<span className="font-semibold">{annuléPar}</span>}
      </div>
    ),
  };
};

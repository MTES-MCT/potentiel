import { Historique } from '@potentiel-domain/historique';
import { Puissance } from '@potentiel-domain/laureat';

export const mapToChangementPuissanceAnnuléTimelineItemProps = (
  changementAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } =
    changementAnnulé.payload as Puissance.ChangementPuissanceAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: (
      <div>
        Changement de puissance annulé par {<span className="font-semibold">{annuléPar}</span>}
      </div>
    ),
  };
};

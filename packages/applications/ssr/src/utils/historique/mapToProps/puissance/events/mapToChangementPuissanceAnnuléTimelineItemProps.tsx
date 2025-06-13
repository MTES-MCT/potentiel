import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementPuissanceAnnuléTimelineItemProps = (
  record: Historique.HistoriquePuissanceProjetListItemReadModel,
) => {
  const { annuléLe, annuléPar } =
    record.payload as Lauréat.Puissance.ChangementPuissanceAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: (
      <div>
        Changement de puissance annulé par {<span className="font-semibold">{annuléPar}</span>}
      </div>
    ),
  };
};

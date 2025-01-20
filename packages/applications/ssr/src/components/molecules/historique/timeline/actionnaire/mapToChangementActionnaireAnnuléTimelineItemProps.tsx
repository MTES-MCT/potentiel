import { Historique } from '@potentiel-domain/historique';
import { Actionnaire } from '@potentiel-domain/laureat';

export const mapToChangementActionnaireAnnuléTimelineItemProps = (
  changementAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    payload: { annuléLe, annuléPar },
  } = changementAnnulé.payload as Actionnaire.ChangementActionnaireAnnuléEvent;

  return {
    date: annuléLe,
    title: (
      <div>
        Changement d'actionnaire annulé par {<span className="font-semibold">{annuléPar}</span>}
      </div>
    ),
  };
};

import { Historique } from '@potentiel-domain/historique';
import { Actionnaire } from '@potentiel-domain/laureat';

export const mapToChangementActionnaireAnnuléTimelineItemProps = (
  changementAnnulé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } =
    changementAnnulé.payload as Actionnaire.ChangementActionnaireAnnuléEvent['payload'];

  return {
    date: annuléLe,
    title: (
      <div>
        Demande de changement d'actionnaire annulée par{' '}
        {<span className="font-semibold">{annuléPar}</span>}
      </div>
    ),
  };
};

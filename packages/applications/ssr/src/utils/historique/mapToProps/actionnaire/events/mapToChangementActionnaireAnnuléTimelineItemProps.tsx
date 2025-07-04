import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementActionnaireAnnuléTimelineItemProps = (
  changementAnnulé: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { annuléLe, annuléPar } =
    changementAnnulé.payload as Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent['payload'];

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

import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementActionnaireAnnuléTimelineItemProps = (
  changementAnnulé: Lauréat.Actionnaire.ChangementActionnaireAnnuléEvent,
) => {
  const { annuléLe, annuléPar } = changementAnnulé.payload;

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

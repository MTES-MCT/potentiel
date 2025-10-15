import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementReprésentantLégalAnnuléTimelineItemProps = (
  changementAnnulé: Lauréat.ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent,
) => {
  const { annuléLe, annuléPar } = changementAnnulé.payload;

  return {
    date: annuléLe,
    title: (
      <div>
        Demande de changement de représentant légal annulée par{' '}
        {<span className="font-semibold">{annuléPar}</span>}
      </div>
    ),
  };
};

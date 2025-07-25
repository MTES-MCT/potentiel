import { Lauréat } from '@potentiel-domain/projet';

export const mapToChangementPuissanceAnnuléTimelineItemProps = (
  record: Lauréat.Puissance.ChangementPuissanceAnnuléEvent,
) => {
  const { annuléLe, annuléPar } = record.payload;

  return {
    date: annuléLe,
    title: (
      <div>
        Changement de puissance annulé par {<span className="font-semibold">{annuléPar}</span>}
      </div>
    ),
  };
};

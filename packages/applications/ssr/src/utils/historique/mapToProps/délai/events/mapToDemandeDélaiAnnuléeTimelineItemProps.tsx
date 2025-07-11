import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeDélaiAnnuléeTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiAnnuléeEvent,
) => {
  const { annuléLe, annuléPar } = record.payload;

  return {
    date: annuléLe,
    title: (
      <div>Demande de délai annulée par {<span className="font-semibold">{annuléPar}</span>}</div>
    ),
  };
};

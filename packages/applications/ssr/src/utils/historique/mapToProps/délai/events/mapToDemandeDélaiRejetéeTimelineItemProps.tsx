import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeDélaiRejetéeTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiRejetéeEvent,
) => {
  const { rejetéeLe, rejetéePar } = record.payload;

  return {
    date: rejetéeLe,
    title: (
      <div>Demande de délai rejetée par {<span className="font-semibold">{rejetéePar}</span>}</div>
    ),
  };
};

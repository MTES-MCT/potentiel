import { Lauréat } from '@potentiel-domain/projet';

export const mapToDemandeDélaiSuppriméeTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiSuppriméeEvent,
) => {
  const { suppriméLe, suppriméPar } = record.payload;

  return {
    date: suppriméLe,
    title: (
      <div>
        Demande de délai supprimée par {<span className="font-semibold">{suppriméPar}</span>}
      </div>
    ),
  };
};

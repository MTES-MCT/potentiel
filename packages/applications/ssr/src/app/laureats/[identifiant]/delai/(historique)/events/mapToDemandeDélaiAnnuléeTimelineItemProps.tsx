import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToDemandeDélaiAnnuléeTimelineItemProps = (
  record: Lauréat.Délai.DemandeDélaiAnnuléeEvent,
) => {
  const { annuléLe, annuléPar } = record.payload;

  return {
    date: annuléLe,
    title: (
      <div>
        Demande de délai annulée <TimelineItemUserEmail email={annuléPar} />
      </div>
    ),
  };
};

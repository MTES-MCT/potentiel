import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
) => {
  const { rejetéLe, rejetéPar } = modification.payload;

  return {
    date: rejetéLe,
    title: (
      <div>
        La demande de mainlevée des garanties financières a été rejetée{' '}
        <TimelineItemUserEmail email={rejetéPar} />
      </div>
    ),
  };
};

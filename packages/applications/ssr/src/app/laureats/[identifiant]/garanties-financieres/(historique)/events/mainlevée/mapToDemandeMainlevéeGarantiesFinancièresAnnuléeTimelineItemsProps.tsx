import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToDemandeMainlevéeGarantiesFinancièresAnnuléeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent,
) => {
  const { annuléLe, annuléPar } = modification.payload;

  return {
    date: annuléLe,
    title: (
      <div>
        La demande de mainlevée des garanties financières a été annulée{' '}
        <TimelineItemUserEmail email={annuléPar} />
      </div>
    ),
  };
};

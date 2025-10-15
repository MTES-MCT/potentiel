import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToDépôtGarantiesFinancièresEnCoursSuppriméTimelineItemsProps = (
  event:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent,
) => {
  const { suppriméLe, suppriméPar } = event.payload;

  return {
    date: suppriméLe,
    title: (
      <div>
        Les nouvelles garanties financières (soumises à instruction) ont été supprimées{' '}
        <TimelineItemUserEmail email={suppriméPar} />
      </div>
    ),
  };
};

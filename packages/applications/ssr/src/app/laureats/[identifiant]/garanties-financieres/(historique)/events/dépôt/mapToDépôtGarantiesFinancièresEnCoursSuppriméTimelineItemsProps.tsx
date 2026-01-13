import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDépôtGarantiesFinancièresEnCoursSuppriméTimelineItemsProps = (
  event:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent,
): TimelineItemProps => {
  const { suppriméLe, suppriméPar } = event.payload;

  return {
    date: suppriméLe,
    title: 'Les nouvelles garanties financières (soumises à instruction) ont été supprimées',
    actor: suppriméPar,
  };
};

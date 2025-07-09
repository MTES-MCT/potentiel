import { Lauréat } from '@potentiel-domain/projet';

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
        Les nouvelles garanties financières (soumises à instruction) ont été supprimées par{' '}
        <span className="font-semibold">{suppriméPar}</span>
      </div>
    ),
  };
};

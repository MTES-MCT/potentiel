import { Lauréat } from '@potentiel-domain/projet';

export const mapToDépôtGarantiesFinancièresEnCoursValidéTimelineItemsProps = (
  event:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
) => {
  const { validéLe, validéPar } = event.payload;

  return {
    date: validéLe,
    title: (
      <div>
        Les nouvelles garanties financières (soumise à instruction) ont été validées par{' '}
        <span className="font-semibold">{validéPar}</span>
      </div>
    ),
  };
};

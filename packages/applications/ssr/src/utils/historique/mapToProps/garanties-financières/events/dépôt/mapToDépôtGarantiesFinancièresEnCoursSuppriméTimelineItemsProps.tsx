import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToDépôtGarantiesFinancièresEnCoursSuppriméTimelineItemsProps = (
  readmodel: Lauréat.HistoriqueGarantiesFinancièresProjetListItemReadModel,
) => {
  const event = match(readmodel)
    .with(
      { type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V1' },
      (event) =>
        event as Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1,
    )
    .with(
      { type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V2' },
      (event) =>
        event as Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent,
    )
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(readmodel);
  }

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

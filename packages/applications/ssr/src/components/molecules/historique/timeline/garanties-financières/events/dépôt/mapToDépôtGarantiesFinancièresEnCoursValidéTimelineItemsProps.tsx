import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToDépôtGarantiesFinancièresEnCoursValidéTimelineItemsProps = (
  dépôtValidé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event = match(dépôtValidé)
    .with(
      { type: 'DépôtGarantiesFinancièresEnCoursValidé-V1' },
      (event) =>
        event as unknown as Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1,
    )
    .with(
      { type: 'DépôtGarantiesFinancièresEnCoursValidé-V2' },
      (event) =>
        event as unknown as Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
    )
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(dépôtValidé);
  }

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

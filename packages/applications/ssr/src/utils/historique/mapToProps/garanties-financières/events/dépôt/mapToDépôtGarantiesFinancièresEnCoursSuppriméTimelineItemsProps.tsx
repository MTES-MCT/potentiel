import { match } from 'ts-pattern';

import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export const mapToDépôtGarantiesFinancièresEnCoursSuppriméTimelineItemsProps = (
  dépôtSupprimé: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const event = match(dépôtSupprimé)
    .with(
      { type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V1' },
      (event) =>
        event as unknown as GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1,
    )
    .with(
      { type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V2' },
      (event) =>
        event as unknown as GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent,
    )
    .otherwise(() => undefined);

  if (!event) {
    return mapToÉtapeInconnueOuIgnoréeTimelineItemProps(dépôtSupprimé);
  }

  const { suppriméLe, suppriméPar } = event.payload;

  return {
    date: suppriméLe,
    title: (
      <div>
        Les nouvelles garanties financières (soumise à instruction) ont été supprimées par{' '}
        <span className="font-semibold">{suppriméPar}</span>
      </div>
    ),
  };
};

import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { Historique } from '@potentiel-domain/historique';

import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { notificationIcon } from '../icons';

import { mapToLauréatCahierDesChargesChoisiTimelineItemProps } from './events';
import { mapToLauréatNotifiéTimelineItemProps } from './events/mapToLauréatNotifiéTimelineItemProps';

export type LauréatHistoryRecord = HistoryRecord<
  'lauréat',
  Lauréat.LauréatEvent['type'],
  Lauréat.LauréatEvent['payload']
>;

export type MapToLauréatTimelineItemProps = (
  readmodel: Historique.HistoriqueLauréatProjetListItemReadModel,
  icon: IconProps,
) => TimelineItemProps;

export const mapToLauréatTimelineItemProps = (record: LauréatHistoryRecord) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: P.union('NomEtLocalitéLauréatImportés-V1', 'LauréatModifié-V1'),
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .with(
      {
        type: P.union('LauréatNotifié-V1', 'LauréatNotifié-V2'),
      },
      (event) => mapToLauréatNotifiéTimelineItemProps(event, notificationIcon),
    )
    .with(
      {
        type: 'CahierDesChargesChoisi-V1',
      },
      (event) => mapToLauréatCahierDesChargesChoisiTimelineItemProps(event, notificationIcon),
    )
    .exhaustive();

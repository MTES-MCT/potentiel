import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToLauréatCahierDesChargesChoisiTimelineItemProps } from './events';
import { mapToLauréatNotifiéTimelineItemProps } from './events/mapToLauréatNotifiéTimelineItemProps';

export type LauréatHistoryRecord = HistoryRecord<
  'lauréat',
  Lauréat.LauréatEvent['type'],
  Lauréat.LauréatEvent['payload']
>;

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
      mapToLauréatNotifiéTimelineItemProps,
    )
    .with(
      {
        type: 'CahierDesChargesChoisi-V1',
      },
      mapToLauréatCahierDesChargesChoisiTimelineItemProps,
    )
    .exhaustive();

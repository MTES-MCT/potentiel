import { match } from 'ts-pattern';

import { Éliminé } from '@potentiel-domain/projet';
import { HistoryRecord } from '@potentiel-domain/entity';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../laureats/[identifiant]/historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToÉliminéNotifiéTimelineItemProps } from './events';

export type ÉliminéHistoryRecord = HistoryRecord<'éliminé', Éliminé.ÉliminéEvent>;

type MapToÉliminéTimelineItemProps = (record: ÉliminéHistoryRecord) => TimelineItemProps;

export const mapToÉliminéTimelineItemProps: MapToÉliminéTimelineItemProps = (record) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'ÉliminéNotifié-V1',
      },
      mapToÉliminéNotifiéTimelineItemProps,
    )
    .with({ type: 'ÉliminéArchivé-V1' }, mapToÉtapeInconnueOuIgnoréeTimelineItemProps)
    .exhaustive();

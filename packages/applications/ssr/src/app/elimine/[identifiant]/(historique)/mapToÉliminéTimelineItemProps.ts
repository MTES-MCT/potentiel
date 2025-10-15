import { match } from 'ts-pattern';

import { Éliminé } from '@potentiel-domain/projet';
import { HistoryRecord } from '@potentiel-domain/entity';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../../../laureats/[identifiant]/historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToÉliminéNotifiéTimelineItemProps } from './events';

export type ÉliminéHistoryRecord = HistoryRecord<'éliminé', Éliminé.ÉliminéEvent>;

export const mapToÉliminéTimelineItemProps = (record: ÉliminéHistoryRecord) =>
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

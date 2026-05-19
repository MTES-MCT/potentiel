import { match } from 'ts-pattern';

import type { HistoryRecord } from '@potentiel-domain/entity';
import type { Éliminé } from '@potentiel-domain/projet';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '@/app/laureats/[identifiant]/(détails)/historique/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import type { TimelineItemProps } from '@/components/organisms/timeline';
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

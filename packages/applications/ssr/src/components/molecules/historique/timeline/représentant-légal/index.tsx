import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { HistoryRecord } from '@potentiel-domain/entity';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToChangementReprésentantLégalAccordéTimelineItemProps } from './mapToChangementReprésentantLégalAccordéTimelineItemProps';
import { mapToChangementReprésentantLégalRejetéTimelineItemProps } from './mapToChangementReprésentantLégalRejetéTimelineItemProps';
import { mapToChangementReprésentantLégalAnnuléTimelineItemProps } from './mapToChangementReprésentantLégalAnnuléTimelineItemProps';
import { mapToReprésentantLégalModifiéTimelineItemProps } from './mapToReprésentantLégalModifiéTimelineItemsProps';
import { mapToChangementReprésentantLégalDemandéTimelineItemProps } from './mapToChangementReprésentantLégalDemandéTimelineItemProps';
import { mapToChangementReprésentantLégalCorrigéTimelineItemProps } from './mapToChangementReprésentantLégalCorrigéTimelineItemProps';
import { mapToReprésentantLégalImportéTimelineItemProps } from './mapToReprésentantLégalImportéTimelineItemsProps';

export const mapToReprésentantLégalTimelineItemProps = (record: HistoryRecord) =>
  match(
    record as HistoryRecord<
      ReprésentantLégal.ReprésentantLégalEvent['type'],
      ReprésentantLégal.ReprésentantLégalEvent['payload']
    >,
  )
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'ReprésentantLégalImporté-V1',
      },
      mapToReprésentantLégalImportéTimelineItemProps,
    )
    .with(
      {
        type: 'ReprésentantLégalModifié-V1',
      },
      mapToReprésentantLégalModifiéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalDemandé-V1',
      },
      mapToChangementReprésentantLégalDemandéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalCorrigé-V1',
      },
      mapToChangementReprésentantLégalCorrigéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalAccordé-V1',
      },
      mapToChangementReprésentantLégalAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalRejeté-V1',
      },
      mapToChangementReprésentantLégalRejetéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalAnnulé-V1',
      },
      mapToChangementReprésentantLégalAnnuléTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementReprésentantLégalSupprimé-V1',
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();

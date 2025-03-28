import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToChangementReprésentantLégalAccordéTimelineItemProps } from './mapToChangementReprésentantLégalAccordéTimelineItemProps';
import { mapToChangementReprésentantLégalRejetéTimelineItemProps } from './mapToChangementReprésentantLégalRejetéTimelineItemProps';
import { mapToChangementReprésentantLégalAnnuléTimelineItemProps } from './mapToChangementReprésentantLégalAnnuléTimelineItemProps';
import { mapToReprésentantLégalModifiéTimelineItemProps } from './mapToReprésentantLégalModifiéTimelineItemsProps';
import { mapToChangementReprésentantLégalDemandéTimelineItemProps } from './mapToChangementReprésentantLégalDemandéTimelineItemProps';
import { mapToChangementReprésentantLégalCorrigéTimelineItemProps } from './mapToChangementReprésentantLégalCorrigéTimelineItemProps';
import { mapToReprésentantLégalImportéTimelineItemProps } from './mapToReprésentantLégalImportéTimelineItemsProps';

type HistoryRecord = {
  category: 'représentant-légal';
  id: string;
  createdAt: string;
  type: ReprésentantLégal.ReprésentantLégalEvent['type'];
  payload: ReprésentantLégal.ReprésentantLégalEvent['payload'];
};

export const mapToReprésentantLégalTimelineItemProps = (record: HistoryRecord) => {
  return match(record)
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
    .otherwise(() => ({
      date: record.createdAt as DateTime.RawType,
      title: 'Étape inconnue',
    }));
};

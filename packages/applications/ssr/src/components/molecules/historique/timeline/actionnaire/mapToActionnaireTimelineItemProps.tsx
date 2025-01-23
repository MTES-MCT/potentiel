import { match } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToChangementActionnaireAccordéTimelineItemProps } from './mapToChangementActionnaireAccordéTimelineItemProps';
import { mapToChangementActionnaireRejetéTimelineItemProps } from './mapToChangementActionnaireRejetéTimelineItemProps';
import { mapToChangementActionnaireAnnuléTimelineItemProps } from './mapToChangementActionnaireAnnuléTimelineItemProps';
import { mapToActionnaireModifiéTimelineItemProps } from './mapToActionnaireModifiéTimelineItemsProps';
import { mapToChangementActionnaireDemandéTimelineItemProps } from './mapToChangementActionnaireDemandéTimelineItemProps';
import { mapToActionnaireImportéTimelineItemProps } from './mapToActionnaireImportéTimelineItemsProps';

export const mapToActionnaireTimelineItemProps = (record: HistoryRecord) => {
  return match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'ActionnaireImporté-V1',
      },
      mapToActionnaireImportéTimelineItemProps,
    )
    .with(
      {
        type: 'ActionnaireModifié-V1',
      },
      mapToActionnaireModifiéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireDemandé-V1',
      },
      mapToChangementActionnaireDemandéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireAccordé-V1',
      },
      mapToChangementActionnaireAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireRejeté-V1',
      },
      mapToChangementActionnaireRejetéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementActionnaireAnnulé-V1',
      },
      mapToChangementActionnaireAnnuléTimelineItemProps,
    )
    .otherwise(() => ({
      date: record.createdAt as DateTime.RawType,
      title: 'Étape inconnue',
    }));
};

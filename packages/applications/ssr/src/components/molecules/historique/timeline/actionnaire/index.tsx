import { match } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Actionnaire } from '@potentiel-domain/laureat';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToChangementActionnaireAccordéTimelineItemProps } from './mapToChangementActionnaireAccordéTimelineItemProps';
import { mapToChangementActionnaireRejetéTimelineItemProps } from './mapToChangementActionnaireRejetéTimelineItemProps';
import { mapToChangementActionnaireAnnuléTimelineItemProps } from './mapToChangementActionnaireAnnuléTimelineItemProps';
import { mapToActionnaireModifiéTimelineItemProps } from './mapToActionnaireModifiéTimelineItemsProps';
import { mapToChangementActionnaireDemandéTimelineItemProps } from './mapToChangementActionnaireDemandéTimelineItemProps';
import { mapToActionnaireImportéTimelineItemProps } from './mapToActionnaireImportéTimelineItemsProps';
import { mapToChangementActionnaireEnregistréTimelineItemProps } from './mapToChangementActionnaireEnregistréTimelineItemProps';

export type ActionnaireHistoryRecord = HistoryRecord<
  'actionnaire',
  Actionnaire.ActionnaireEvent['type'],
  Actionnaire.ActionnaireEvent['payload']
>;

export const mapToActionnaireTimelineItemProps = (record: ActionnaireHistoryRecord) =>
  match(record)
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
        type: 'ChangementActionnaireEnregistré-V1',
      },
      mapToChangementActionnaireEnregistréTimelineItemProps,
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
    .with(
      {
        type: 'ChangementActionnaireSupprimé-V1',
      },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();

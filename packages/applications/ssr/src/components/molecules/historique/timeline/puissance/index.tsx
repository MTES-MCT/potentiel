import { match, P } from 'ts-pattern';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Puissance } from '@potentiel-domain/laureat';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { mapToChangementPuissanceDemandéTimelineItemProps } from './mapToChangementPuissanceDemandéTimelineItemProps';
import { mapToPuissanceImportéeTimelineItemsProps } from './mapToPuissanceImportéeTimelineItemsProps';
import { mapToPuissanceModifiéeTimelineItemsProps } from './mapToPuissanceModifiéeTimelineItemsProps';
import { mapToChangementPuissanceEnregistréTimelineItemProps } from './mapToChangementPuissanceEnregistréTimelineItemProps';
import { mapToChangementPuissanceAccordéTimelineItemProps } from './mapToChangementPuissanceAccordéTimelineItemProps';
import { mapToChangementPuissanceRejetéTimelineItemProps } from './mapToChangementPuissanceRejetéTimelineItemProps';

export type PuissanceHistoryRecord = HistoryRecord<
  'puissance',
  Puissance.PuissanceEvent['type'],
  Puissance.PuissanceEvent['payload']
>;

export const mapToPuissanceTimelineItemProps = (record: PuissanceHistoryRecord) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with({ type: 'PuissanceImportée-V1' }, mapToPuissanceImportéeTimelineItemsProps)
    .with({ type: 'PuissanceModifiée-V1' }, mapToPuissanceModifiéeTimelineItemsProps)
    .with(
      {
        type: 'ChangementPuissanceDemandé-V1',
      },
      mapToChangementPuissanceDemandéTimelineItemProps,
    )
    .with(
      { type: 'ChangementPuissanceEnregistré-V1' },
      mapToChangementPuissanceEnregistréTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementPuissanceAccordé-V1',
      },
      mapToChangementPuissanceAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'ChangementPuissanceRejeté-V1',
      },
      mapToChangementPuissanceRejetéTimelineItemProps,
    )
    .with(
      { type: P.union('ChangementPuissanceAnnulé-V1', 'ChangementPuissanceSupprimé-V1') },
      mapToÉtapeInconnueOuIgnoréeTimelineItemProps,
    )
    .exhaustive();

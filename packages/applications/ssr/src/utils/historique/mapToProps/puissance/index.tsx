import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/Timeline';
import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '../mapToÉtapeInconnueOuIgnoréeTimelineItemProps';
import { mapToChangementPuissanceAccordéTimelineItemProps } from './events/mapToChangementPuissanceAccordéTimelineItemProps';
import { mapToChangementPuissanceAnnuléTimelineItemProps } from './events/mapToChangementPuissanceAnnuléTimelineItemProps';
import { mapToChangementPuissanceDemandéTimelineItemProps } from './events/mapToChangementPuissanceDemandéTimelineItemProps';
import { mapToChangementPuissanceEnregistréTimelineItemProps } from './events/mapToChangementPuissanceEnregistréTimelineItemProps';
import { mapToChangementPuissanceRejetéTimelineItemProps } from './events/mapToChangementPuissanceRejetéTimelineItemProps';
import { mapToPuissanceImportéeTimelineItemsProps } from './events/mapToPuissanceImportéeTimelineItemsProps';
import { mapToPuissanceModifiéeTimelineItemsProps } from './events/mapToPuissanceModifiéeTimelineItemsProps';

export const mapToPuissanceTimelineItemProps = (
  record: Lauréat.Puissance.HistoriquePuissanceProjetListItemReadModel,
  unitéPuissance: string,
) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with({ type: 'PuissanceImportée-V1' }, (record) =>
      mapToPuissanceImportéeTimelineItemsProps(record, unitéPuissance),
    )
    .with({ type: 'PuissanceModifiée-V1' }, (record) =>
      mapToPuissanceModifiéeTimelineItemsProps(record, unitéPuissance),
    )
    .with(
      {
        type: 'ChangementPuissanceDemandé-V1',
      },
      (record) => mapToChangementPuissanceDemandéTimelineItemProps(record, unitéPuissance),
    )
    .with(
      {
        type: 'ChangementPuissanceAnnulé-V1',
      },
      mapToChangementPuissanceAnnuléTimelineItemProps,
    )
    .with({ type: 'ChangementPuissanceEnregistré-V1' }, (record) =>
      mapToChangementPuissanceEnregistréTimelineItemProps(record, unitéPuissance),
    )
    .with(
      {
        type: 'ChangementPuissanceAccordé-V1',
      },
      (record) => mapToChangementPuissanceAccordéTimelineItemProps(record, unitéPuissance),
    )
    .with(
      {
        type: 'ChangementPuissanceRejeté-V1',
      },
      (record) => mapToChangementPuissanceRejetéTimelineItemProps(record),
    )
    .with({ type: 'ChangementPuissanceSupprimé-V1' }, mapToÉtapeInconnueOuIgnoréeTimelineItemProps)
    .exhaustive();

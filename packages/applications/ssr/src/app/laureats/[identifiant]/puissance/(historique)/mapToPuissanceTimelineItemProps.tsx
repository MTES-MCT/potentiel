import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToChangementPuissanceDemandéTimelineItemProps } from './events/mapToChangementPuissanceDemandéTimelineItemProps';
import { mapToPuissanceImportéeTimelineItemsProps } from './events/mapToPuissanceImportéeTimelineItemsProps';
import { mapToPuissanceModifiéeTimelineItemsProps } from './events/mapToPuissanceModifiéeTimelineItemsProps';
import { mapToChangementPuissanceAnnuléTimelineItemProps } from './events/mapToChangementPuissanceAnnuléTimelineItemProps';
import { mapToChangementPuissanceEnregistréTimelineItemProps } from './events/mapToChangementPuissanceEnregistréTimelineItemProps';
import { mapToChangementPuissanceAccordéTimelineItemProps } from './events/mapToChangementPuissanceAccordéTimelineItemProps';
import { mapToChangementPuissanceRejetéTimelineItemProps } from './events/mapToChangementPuissanceRejetéTimelineItemProps';
import { mapToChangementPuissanceSuppriméTimelineItemProps } from './events/mapToChangementPuissanceSuppriméTimelineItemProps';

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
    .with(
      { type: 'ChangementPuissanceSupprimé-V1' },
      mapToChangementPuissanceSuppriméTimelineItemProps,
    )
    .exhaustive();

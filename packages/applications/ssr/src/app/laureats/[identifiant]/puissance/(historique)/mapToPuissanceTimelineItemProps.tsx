import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { mapToChangementPuissanceAccordéTimelineItemProps } from './events/mapToChangementPuissanceAccordéTimelineItemProps';
import { mapToChangementPuissanceAnnuléTimelineItemProps } from './events/mapToChangementPuissanceAnnuléTimelineItemProps';
import { mapToChangementPuissanceDemandéTimelineItemProps } from './events/mapToChangementPuissanceDemandéTimelineItemProps';
import { mapToChangementPuissanceEnregistréTimelineItemProps } from './events/mapToChangementPuissanceEnregistréTimelineItemProps';
import { mapToChangementPuissanceRejetéTimelineItemProps } from './events/mapToChangementPuissanceRejetéTimelineItemProps';
import { mapToChangementPuissanceSuppriméTimelineItemProps } from './events/mapToChangementPuissanceSuppriméTimelineItemProps';
import { mapToPuissanceImportéeTimelineItemsProps } from './events/mapToPuissanceImportéeTimelineItemsProps';
import { mapToPuissanceModifiéeTimelineItemsProps } from './events/mapToPuissanceModifiéeTimelineItemsProps';

export const mapToPuissanceTimelineItemProps = ({
  event,
  unitéPuissance,
}: {
  event: Lauréat.Puissance.HistoriquePuissanceProjetListItemReadModel;
  unitéPuissance: string;
}) =>
  match(event)
    .returnType<TimelineItemProps>()
    .with({ type: 'PuissanceImportée-V1' }, (event) =>
      mapToPuissanceImportéeTimelineItemsProps(event, unitéPuissance),
    )
    .with({ type: 'PuissanceModifiée-V1' }, (event) =>
      mapToPuissanceModifiéeTimelineItemsProps(event, unitéPuissance),
    )
    .with(
      {
        type: 'ChangementPuissanceDemandé-V1',
      },
      (event) =>
        mapToChangementPuissanceDemandéTimelineItemProps({
          event,
          unitéPuissance,
        }),
    )
    .with(
      {
        type: 'ChangementPuissanceAnnulé-V1',
      },
      mapToChangementPuissanceAnnuléTimelineItemProps,
    )
    .with({ type: 'ChangementPuissanceEnregistré-V1' }, (event) =>
      mapToChangementPuissanceEnregistréTimelineItemProps(event, unitéPuissance),
    )
    .with(
      {
        type: 'ChangementPuissanceAccordé-V1',
      },
      (event) => mapToChangementPuissanceAccordéTimelineItemProps(event, unitéPuissance),
    )
    .with(
      {
        type: 'ChangementPuissanceRejeté-V1',
      },
      (event) => mapToChangementPuissanceRejetéTimelineItemProps(event),
    )
    .with(
      { type: 'ChangementPuissanceSupprimé-V1' },
      mapToChangementPuissanceSuppriméTimelineItemProps,
    )
    .exhaustive();

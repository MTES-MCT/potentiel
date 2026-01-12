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

export const mapToPuissanceTimelineItemProps = ({
  event,
  unitéPuissance,
  isHistoriqueProjet,
}: {
  event: Lauréat.Puissance.HistoriquePuissanceProjetListItemReadModel;
  unitéPuissance: string;
  isHistoriqueProjet?: true;
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
          isHistoriqueProjet,
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

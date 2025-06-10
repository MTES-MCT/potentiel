import { match } from 'ts-pattern';
import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from '@/components/molecules/historique/timeline/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

import { DétailsPuissancePageProps } from '../DétailsPuissance.page';

import { mapToChangementPuissanceDemandéTimelineItemProps } from './mapToChangementPuissanceDemandéTimelineItemProps';
import { mapToPuissanceImportéeTimelineItemsProps } from './mapToPuissanceImportéeTimelineItemsProps';
import { mapToPuissanceModifiéeTimelineItemsProps } from './mapToPuissanceModifiéeTimelineItemsProps';
import { mapToChangementPuissanceAnnuléTimelineItemProps } from './mapToChangementPuissanceAnnuléTimelineItemProps';
import { mapToChangementPuissanceEnregistréTimelineItemProps } from './mapToChangementPuissanceEnregistréTimelineItemProps';
import { mapToChangementPuissanceAccordéTimelineItemProps } from './mapToChangementPuissanceAccordéTimelineItemProps';
import { mapToChangementPuissanceRejetéTimelineItemProps } from './mapToChangementPuissanceRejetéTimelineItemProps';

export type HistoriquePuissanceTimelineProps = {
  historique: PlainType<Historique.ListerHistoriquePuissanceProjetReadModel>;
  unitéPuissance: DétailsPuissancePageProps['unitéPuissance'];
};
export const HistoriquePuissanceTimeline: FC<HistoriquePuissanceTimelineProps> = ({
  historique,
  unitéPuissance,
}) => (
  <Timeline
    items={historique.items.map((item) => mapToPuissanceTimelineItemProps(item, unitéPuissance))}
  />
);

const mapToPuissanceTimelineItemProps = (
  record: Historique.HistoriquePuissanceProjetListItemReadModel,
  unitéPuissance: HistoriquePuissanceTimelineProps['unitéPuissance'],
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

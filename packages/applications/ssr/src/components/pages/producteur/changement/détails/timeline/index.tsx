import { match } from 'ts-pattern';
import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToChangementProducteurEnregistréTimelineItemProps } from './mapToChangementProducteurEnregistréTimelineItemProps';
import { mapToProducteurModifiéTimelineItemsProps } from './mapToProducteurModifiéTimelineItemsProps';
import { mapToProducteurImportéTimelineItemProps } from './mapToProducteurImportéTimelineItemProps';

export type HistoriqueProducteurTimelineProps = {
  historique: PlainType<
    Historique.ListerHistoriqueProjetReadModel<Historique.ProducteurHistoryRecord>
  >;
};
export const HistoriqueProducteurTimeline: FC<HistoriqueProducteurTimelineProps> = ({
  historique,
}) => <Timeline items={historique.items.map((item) => mapToProducteurTimelineItemProps(item))} />;

const mapToProducteurTimelineItemProps = (record: Historique.ProducteurHistoryRecord) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with({ type: 'ProducteurImporté-V1' }, (record) =>
      mapToProducteurImportéTimelineItemProps(record),
    )
    .with({ type: 'ProducteurModifié-V1' }, (record) =>
      mapToProducteurModifiéTimelineItemsProps(record),
    )
    .with({ type: 'ChangementProducteurEnregistré-V1' }, (record) =>
      mapToChangementProducteurEnregistréTimelineItemProps(record),
    )
    .exhaustive();

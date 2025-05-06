import { match } from 'ts-pattern';
import { FC } from 'react';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Producteur } from '@potentiel-domain/laureat';
import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToChangementProducteurEnregistréTimelineItemProps } from './mapToChangementProducteurEnregistréTimelineItemProps';
import { mapToProducteurImportéTimelineItemsProps } from './mapToProducteurImportéTimelineItemsProps';
import { mapToProducteurModifiéTimelineItemsProps } from './mapToProducteurModifiéTimelineItemsProps';

export type HistoriqueProducteurTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel<ProducteurHistoryRecord>>;
};
export const HistoriqueProducteurTimeline: FC<HistoriqueProducteurTimelineProps> = ({
  historique,
}) => <Timeline items={historique.items.map((item) => mapToProducteurTimelineItemProps(item))} />;

export type ProducteurHistoryRecord = HistoryRecord<
  'producteur',
  Producteur.ProducteurEvent['type'],
  Producteur.ProducteurEvent['payload']
>;

const mapToProducteurTimelineItemProps = (record: ProducteurHistoryRecord) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with({ type: 'ProducteurImporté-V1' }, (record) =>
      mapToProducteurImportéTimelineItemsProps(record),
    )
    .with({ type: 'ProducteurModifié-V1' }, (record) =>
      mapToProducteurModifiéTimelineItemsProps(record),
    )
    .with({ type: 'ChangementProducteurEnregistré-V1' }, (record) =>
      mapToChangementProducteurEnregistréTimelineItemProps(record),
    )
    .exhaustive();

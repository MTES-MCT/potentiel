import { match } from 'ts-pattern';
import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToChangementProducteurEnregistréTimelineItemProps } from './mapToChangementProducteurEnregistréTimelineItemProps';
import { mapToProducteurModifiéTimelineItemsProps } from './mapToProducteurModifiéTimelineItemsProps';
import { mapToProducteurImportéTimelineItemProps } from './mapToProducteurImportéTimelineItemProps';

export type HistoriqueProducteurTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProducteurProjetReadModel>;
};
export const HistoriqueProducteurTimeline: FC<HistoriqueProducteurTimelineProps> = ({
  historique,
}) => <Timeline items={historique.items.map((item) => mapToProducteurTimelineItemProps(item))} />;

const mapToProducteurTimelineItemProps = (
  readmodel: Historique.HistoriqueProducteurProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with({ type: 'ProducteurImporté-V1' }, (readmodel) =>
      mapToProducteurImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'ProducteurModifié-V1' }, (readmodel) =>
      mapToProducteurModifiéTimelineItemsProps(readmodel),
    )
    .with({ type: 'ChangementProducteurEnregistré-V1' }, (readmodel) =>
      mapToChangementProducteurEnregistréTimelineItemProps(readmodel),
    )
    .exhaustive();

import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToAbandonTimelineItemProps } from './timeline/abandon/mapToAbandonTimelineItem';
import { mapToRecoursTimelineItemProps } from './timeline/recours';
import { mapToActionnaireTimelineItemProps } from './timeline/actionnaire';
import { mapToReprésentantLégalTimelineItemProps } from './timeline/représentant-légal';
import { mapToLauréatTimelineItemProps } from './timeline/lauréat/mapToLauréatTimelineItemProps';

export type HistoriqueTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel<Historique.HistoryReadModel>>;
};

export const HistoriqueTimeline: FC<HistoriqueTimelineProps> = ({ historique }) => (
  <Timeline items={historique.items.map((item) => mapToTimelineItemProps(item))} />
);

const mapToTimelineItemProps = (record: Historique.HistoryReadModel) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        category: 'abandon',
      },
      mapToAbandonTimelineItemProps,
    )
    .with(
      {
        category: 'recours',
      },
      mapToRecoursTimelineItemProps,
    )
    .with({ category: 'actionnaire' }, mapToActionnaireTimelineItemProps)
    .with({ category: 'représentant-légal' }, mapToReprésentantLégalTimelineItemProps)
    .with({ category: 'lauréat' }, mapToLauréatTimelineItemProps)
    .exhaustive();

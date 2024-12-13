import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';
import { HistoryRecord } from '@potentiel-domain/entity';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToAbandonTimelineItemProps } from './timeline/abandon/mapToAbandonTimelineItemProps';

export type HistoriqueTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel>;
};

export const HistoriqueTimeline: FC<HistoriqueTimelineProps> = ({ historique }) => {
  return <Timeline items={historique.items.map((item) => mapToTimelineItemProps(item))} />;
};

const mapToTimelineItemProps = (record: HistoryRecord) => {
  return match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        category: 'abandon',
      },
      mapToAbandonTimelineItemProps,
    )
    .otherwise(() => ({
      date: record.createdAt as DateTime.RawType,
      title: 'Étape inconnue',
    }));
};

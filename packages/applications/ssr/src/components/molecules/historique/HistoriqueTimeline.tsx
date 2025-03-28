import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';
import { HistoryRecord } from '@potentiel-domain/entity';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToAbandonTimelineItemProps } from './timeline/abandon';
import { mapToRecoursTimelineItemProps } from './timeline/recours';
import { mapToActionnaireTimelineItemProps } from './timeline/actionnaire';
import { mapToReprésentantLégalTimelineItemProps } from './timeline/représentant-légal';
import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from './timeline/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export type HistoriqueTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel>;
};

export const HistoriqueTimeline: FC<HistoriqueTimelineProps> = ({ historique }) => (
  <Timeline items={historique.items.map((item) => mapToTimelineItemProps(item))} />
);

const mapToTimelineItemProps = (record: HistoryRecord) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with(
      {
        category: 'abandon',
      },
      (record) => mapToAbandonTimelineItemProps(record),
    )
    .with(
      {
        category: 'recours',
      },
      (record) => mapToRecoursTimelineItemProps(record),
    )
    .with({ category: 'actionnaire' }, (record) => mapToActionnaireTimelineItemProps(record))
    .with({ category: 'représentant-légal' }, (record) =>
      mapToReprésentantLégalTimelineItemProps(record),
    )
    .otherwise((record) => mapToÉtapeInconnueOuIgnoréeTimelineItemProps(record));

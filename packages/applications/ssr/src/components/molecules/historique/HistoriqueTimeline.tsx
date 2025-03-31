import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { AbandonHistoryRecord, mapToAbandonTimelineItemProps } from './timeline/abandon';
import { mapToRecoursTimelineItemProps, RecoursHistoryRecord } from './timeline/recours';
import {
  ActionnaireHistoryRecord,
  mapToActionnaireTimelineItemProps,
} from './timeline/actionnaire';
import {
  mapToReprésentantLégalTimelineItemProps,
  ReprésentantLégalHistoryRecord,
} from './timeline/représentant-légal';
import { mapToÉtapeInconnueOuIgnoréeTimelineItemProps } from './timeline/mapToÉtapeInconnueOuIgnoréeTimelineItemProps';

export type HistoriqueTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel<HistoryReadModel>>;
};

type HistoryReadModel =
  | AbandonHistoryRecord
  | ActionnaireHistoryRecord
  | RecoursHistoryRecord
  | ReprésentantLégalHistoryRecord;

export const HistoriqueTimeline: FC<HistoriqueTimelineProps> = ({ historique }) => (
  <Timeline items={historique.items.map((item) => mapToTimelineItemProps(item))} />
);

const mapToTimelineItemProps = (record: HistoryReadModel) =>
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

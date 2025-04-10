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
import { mapToPuissanceTimelineItemProps, PuissanceHistoryRecord } from './timeline/puissance';

export type HistoriqueTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel<HistoryReadModel>>;
};

type HistoryReadModel =
  | AbandonHistoryRecord
  | ActionnaireHistoryRecord
  | RecoursHistoryRecord
  | ReprésentantLégalHistoryRecord
  | PuissanceHistoryRecord;

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
    .with({ category: 'puissance' }, mapToPuissanceTimelineItemProps)
    .exhaustive();

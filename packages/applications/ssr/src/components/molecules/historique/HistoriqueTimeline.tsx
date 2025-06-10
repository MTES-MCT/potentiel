import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToAbandonTimelineItemProps } from './timeline/abandon/mapToAbandonTimelineItemProps';
import { mapToRecoursTimelineItemProps } from './timeline/recours/mapToRecoursTimelineItemProps';
import { mapToActionnaireTimelineItemProps } from './timeline/actionnaire/mapToActionnaireTimelineItemProps';
import { mapToReprésentantLégalTimelineItemProps } from './timeline/représentant-légal/mapToReprésentantLégalTimelineItemProps';
import { mapToLauréatTimelineItemProps } from './timeline/lauréat/mapToLauréatTimelineItemProps';
import { mapToGarantiesFinancièresTimelineItemProps } from './timeline/garanties-financières/mapToGarantiesFinancièresTimelineItemProps';

export type HistoriqueTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel['items']>;
};

export const HistoriqueTimeline: FC<HistoriqueTimelineProps> = ({ historique }) => (
  <Timeline
    items={historique
      .map((item) => mapToTimelineItemProps(item))
      .filter((item) => item !== undefined)}
  />
);

const mapToTimelineItemProps = (readmodel: Historique.HistoriqueListItemReadModels) =>
  match(readmodel)
    .returnType<TimelineItemProps | undefined>()
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
    .with({ category: 'garanties-financieres' }, mapToGarantiesFinancièresTimelineItemProps)
    .exhaustive(() => undefined);

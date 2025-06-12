import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { mapToPuissanceTimelineItemProps } from '@/components/pages/puissance/changement/détails/timeline';
import { mapToProducteurTimelineItemProps } from '@/components/pages/producteur/changement/détails/timeline';

import { mapToAbandonTimelineItemProps } from './timeline/abandon/mapToAbandonTimelineItemProps';
import { mapToRecoursTimelineItemProps } from './timeline/recours/mapToRecoursTimelineItemProps';
import { mapToActionnaireTimelineItemProps } from './timeline/actionnaire/mapToActionnaireTimelineItemProps';
import { mapToReprésentantLégalTimelineItemProps } from './timeline/représentant-légal/mapToReprésentantLégalTimelineItemProps';
import { mapToLauréatTimelineItemProps } from './timeline/lauréat/mapToLauréatTimelineItemProps';
import { mapToGarantiesFinancièresTimelineItemProps } from './timeline/garanties-financières/mapToGarantiesFinancièresTimelineItemProps';
import { mapToAchèvementTimelineItemProps } from './timeline/achèvement/mapToAchèvementTimelineItemProps';
import { mapToRaccordementTimelineItemProps } from './timeline/raccordement/mapToRaccordementTimelineItemProps';

export type HistoriqueTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel['items']>;
  unitéPuissance?: string;
};

export const HistoriqueTimeline: FC<HistoriqueTimelineProps> = ({
  historique,
  unitéPuissance = 'MW',
}) => (
  <Timeline
    items={historique
      .map((item) => mapToTimelineItemProps(item, unitéPuissance))
      .filter((item) => item !== undefined)}
  />
);

const mapToTimelineItemProps = (
  readmodel: Historique.HistoriqueListItemReadModels,
  unitéPuissance: string,
) =>
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
    .with({ category: 'producteur' }, mapToProducteurTimelineItemProps)
    .with({ category: 'puissance' }, (readmodel) =>
      mapToPuissanceTimelineItemProps(readmodel, unitéPuissance),
    )
    .with({ category: 'achevement' }, mapToAchèvementTimelineItemProps)
    .with({ category: 'raccordement' }, mapToRaccordementTimelineItemProps)
    .exhaustive(() => undefined);

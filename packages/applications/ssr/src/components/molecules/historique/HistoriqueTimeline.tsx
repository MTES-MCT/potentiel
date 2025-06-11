import { FC } from 'react';
import { match } from 'ts-pattern';

import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';
import { AppelOffre } from '@potentiel-domain/appel-offre';

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

export type HistoriqueTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel['items']>;
  unitéPuissance?: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'];
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
  unitéPuissance: AppelOffre.ConsulterAppelOffreReadModel['unitePuissance'],
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
    .exhaustive(() => undefined);

import { match } from 'ts-pattern';
import { FC } from 'react';

import { HistoryRecord } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Historique } from '@potentiel-domain/historique';

import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToChangementFournisseurEnregistréTimelineItemProps } from './mapToChangementFournisseurEnregistréTimelineItemProps';
import { mapToÉvaluationCarboneModifiéeTimelineItemsProps } from './mapToÉvaluationCarboneModifiéeTimelineItemsProps';
import { mapToFournisseurImportéTimelineItemProps } from './mapToFournisseurImportéTimelineItemProps';

export type HistoriqueFournisseurTimelineProps = {
  historique: PlainType<Historique.ListerHistoriqueProjetReadModel<FournisseurHistoryRecord>>;
};
export const HistoriqueFournisseurTimeline: FC<HistoriqueFournisseurTimelineProps> = ({
  historique,
}) => <Timeline items={historique.items.map((item) => mapToFournisseurTimelineItemProps(item))} />;

export type FournisseurHistoryRecord = HistoryRecord<
  'fournisseur',
  Lauréat.Fournisseur.FournisseurEvent['type'],
  Lauréat.Fournisseur.FournisseurEvent['payload']
>;

const mapToFournisseurTimelineItemProps = (record: FournisseurHistoryRecord) =>
  match(record)
    .returnType<TimelineItemProps>()
    .with({ type: 'FournisseurImporté-V1' }, mapToFournisseurImportéTimelineItemProps)
    .with(
      { type: 'ÉvaluationCarboneSimplifiéeModifiée-V1' },
      mapToÉvaluationCarboneModifiéeTimelineItemsProps,
    )
    .with(
      { type: 'ChangementFournisseurEnregistré-V1' },
      mapToChangementFournisseurEnregistréTimelineItemProps,
    )
    .exhaustive();

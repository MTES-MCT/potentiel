import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import {
  mapToChangementFournisseurEnregistréTimelineItemProps,
  mapToFournisseurImportéTimelineItemProps,
  mapToFournisseurModifiéTimelineItemProps,
  mapToÉvaluationCarboneModifiéeTimelineItemsProps,
} from './events';

type MapToFournisseurTimelineItemProps = (
  readmodel: Lauréat.Fournisseur.HistoriqueFournisseurProjetListItemReadModel,
) => TimelineItemProps;

export const mapToFournisseurTimelineItemProps: MapToFournisseurTimelineItemProps = (readmodel) =>
  match(readmodel)
    .with({ type: 'FournisseurImporté-V1' }, mapToFournisseurImportéTimelineItemProps)
    .with(
      { type: 'ÉvaluationCarboneSimplifiéeModifiée-V1' },
      mapToÉvaluationCarboneModifiéeTimelineItemsProps,
    )
    .with(
      { type: 'ChangementFournisseurEnregistré-V1' },
      mapToChangementFournisseurEnregistréTimelineItemProps,
    )
    .with({ type: 'FournisseurModifié-V1' }, mapToFournisseurModifiéTimelineItemProps)
    .exhaustive();

import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import {
  mapToFournisseurImportéTimelineItemProps,
  mapToChangementFournisseurEnregistréTimelineItemProps,
  mapToÉvaluationCarboneModifiéeTimelineItemsProps,
} from './events';

export const mapToFournisseurTimelineItemProps = (
  readmodel: Lauréat.Fournisseur.HistoriqueFournisseurProjetListItemReadModel,
) =>
  match(readmodel)
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

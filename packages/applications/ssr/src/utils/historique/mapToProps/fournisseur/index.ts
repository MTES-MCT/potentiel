import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/Timeline';
import {
  mapToChangementFournisseurEnregistréTimelineItemProps,
  mapToFournisseurImportéTimelineItemProps,
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

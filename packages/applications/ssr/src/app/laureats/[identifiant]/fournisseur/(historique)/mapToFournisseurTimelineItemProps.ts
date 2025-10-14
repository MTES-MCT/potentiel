import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import {
  mapToFournisseurImportéTimelineItemProps,
  mapToChangementFournisseurEnregistréTimelineItemProps,
  mapToÉvaluationCarboneModifiéeTimelineItemsProps,
  mapToFournisseurModifiéTimelineItemProps,
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
    .with({ type: 'FournisseurModifié-V1' }, mapToFournisseurModifiéTimelineItemProps)
    .exhaustive();

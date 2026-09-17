import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import {
  mapToChangementFournisseurEnregistréTimelineItemProps,
  mapToFournisseurImportéTimelineItemProps,
  mapToFournisseurModifiéTimelineItemProps,
  mapToÉvaluationCarboneModifiéeTimelineItemsProps,
} from './events';

type MapToFournisseurTimelineItemProps = (
  readmodel: Lauréat.Fournisseur.HistoriqueFournisseurProjetListItemReadModel,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
) => TimelineItemProps;

export const mapToFournisseurTimelineItemProps: MapToFournisseurTimelineItemProps = (
  readmodel,
  rôleUtilisateur,
) =>
  match(readmodel)
    .with({ type: 'FournisseurImporté-V1' }, mapToFournisseurImportéTimelineItemProps)
    .with(
      { type: 'ÉvaluationCarboneSimplifiéeModifiée-V1' },
      mapToÉvaluationCarboneModifiéeTimelineItemsProps,
    )
    .with({ type: 'ChangementFournisseurEnregistré-V1' }, (event) =>
      mapToChangementFournisseurEnregistréTimelineItemProps(event, rôleUtilisateur),
    )
    .with({ type: 'FournisseurModifié-V1' }, mapToFournisseurModifiéTimelineItemProps)
    .exhaustive();

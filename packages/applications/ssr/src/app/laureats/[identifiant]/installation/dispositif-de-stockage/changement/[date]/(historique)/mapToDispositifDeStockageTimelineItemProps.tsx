import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { mapToDispositifDeStockageEnregistréTimelineItemsProps } from '../../../../(historique)/events/mapToDispositifDeStockageEnregistréTimelineItemsProps';
import { mapToDispositifDeStockageModifiéTimelineItemsProps } from '../../../../(historique)/events/mapToDispositifDeStockageModifiéTimelineItemsProps';
import { mapToDispositifDeStockageImportéTimelineItemProps } from './events/mapToDispositifDeStockageImportéTimelineItemProps';

type MapToInstallationTimelineItemProps = (
  readmodel: Lauréat.Installation.HistoriqueInstallationProjetListItemReadModel,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
) => TimelineItemProps | null;

export const mapToDispositifDeStockageTimelineItemProps: MapToInstallationTimelineItemProps = (
  readmodel,
  rôleUtilisateur,
) =>
  match(readmodel)
    .with({ type: 'InstallationImportée-V1' }, (readmodel) =>
      mapToDispositifDeStockageImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'DispositifDeStockageModifié-V1' }, (readmodel) =>
      mapToDispositifDeStockageModifiéTimelineItemsProps(readmodel),
    )
    .with({ type: 'ChangementDispositifDeStockageEnregistré-V1' }, (readmodel) =>
      mapToDispositifDeStockageEnregistréTimelineItemsProps(readmodel, rôleUtilisateur),
    )
    .with(
      {
        type: P.union(
          'TypologieInstallationModifiée-V1',
          'ChangementInstallateurEnregistré-V1',
          'InstallateurModifié-V1',
        ),
      },
      () => null,
    )
    .exhaustive();

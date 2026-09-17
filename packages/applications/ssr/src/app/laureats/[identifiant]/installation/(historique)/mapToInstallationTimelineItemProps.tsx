import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { mapToChangementInstallateurEnregistréTimelineItemsProps } from './events/mapToChangementInstallateurEnregistréTimelineItemsProps';
import { mapToDispositifDeStockageEnregistréTimelineItemsProps } from './events/mapToDispositifDeStockageEnregistréTimelineItemsProps';
import { mapToDispositifDeStockageModifiéTimelineItemsProps } from './events/mapToDispositifDeStockageModifiéTimelineItemsProps';
import { mapToInstallateurModifiéTimelineItemsProps } from './events/mapToInstallateurModifiéTimelineItemsProps';
import { mapToInstallationImportéeTimelineItemProps } from './events/mapToInstallationImportéeTimelineItemProps';
import { mapToTypologieInstallationModifiéeTimelineItemsProps } from './events/mapToTypologieInstallationModifiéeTimelineItemsProps';

type MapToInstallationTimelineItemProps = (
  readmodel: Lauréat.Installation.HistoriqueInstallationProjetListItemReadModel,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
) => TimelineItemProps;

export const mapToInstallationTimelineItemProps: MapToInstallationTimelineItemProps = (
  readmodel,
  rôleUtilisateur,
) =>
  match(readmodel)
    .with({ type: 'InstallationImportée-V1' }, (readmodel) =>
      mapToInstallationImportéeTimelineItemProps(readmodel),
    )
    .with({ type: 'InstallateurModifié-V1' }, (readmodel) =>
      mapToInstallateurModifiéTimelineItemsProps(readmodel),
    )
    .with({ type: 'TypologieInstallationModifiée-V1' }, (readmodel) =>
      mapToTypologieInstallationModifiéeTimelineItemsProps(readmodel),
    )
    .with({ type: 'DispositifDeStockageModifié-V1' }, (readmodel) =>
      mapToDispositifDeStockageModifiéTimelineItemsProps(readmodel),
    )
    .with({ type: 'ChangementInstallateurEnregistré-V1' }, (readmodel) =>
      mapToChangementInstallateurEnregistréTimelineItemsProps(readmodel, rôleUtilisateur),
    )
    .with({ type: 'ChangementDispositifDeStockageEnregistré-V1' }, (readmodel) =>
      mapToDispositifDeStockageEnregistréTimelineItemsProps(readmodel, rôleUtilisateur),
    )
    .exhaustive();

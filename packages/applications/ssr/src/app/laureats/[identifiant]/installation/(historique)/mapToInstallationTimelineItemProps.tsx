import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import { mapToChangementInstallateurEnregistréTimelineItemsProps } from './events/mapToChangementInstallateurEnregistréTimelineItemsProps';
import { mapToDispositifDeStockageEnregistréTimelineItemsProps } from './events/mapToDispositifDeStockageEnregistréTimelineItemsProps';
import { mapToDispositifDeStockageModifiéTimelineItemsProps } from './events/mapToDispositifDeStockageModifiéTimelineItemsProps';
import { mapToInstallateurModifiéTimelineItemsProps } from './events/mapToInstallateurModifiéTimelineItemsProps';
import { mapToInstallationImportéeTimelineItemProps } from './events/mapToInstallationImportéeTimelineItemProps';
import { mapToTypologieInstallationModifiéeTimelineItemsProps } from './events/mapToTypologieInstallationModifiéeTimelineItemsProps';

type MapToInstallationTimelineItemProps = {
  readmodel: Lauréat.Installation.HistoriqueInstallationProjetListItemReadModel;
  permissionConsulterChangementInstallateur: boolean;
  permissionConsulterChangementDispositifDeStockage: boolean;
};

export const mapToInstallationTimelineItemProps = ({
  readmodel,
  permissionConsulterChangementInstallateur,
  permissionConsulterChangementDispositifDeStockage,
}: MapToInstallationTimelineItemProps) =>
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
      mapToChangementInstallateurEnregistréTimelineItemsProps(
        readmodel,
        permissionConsulterChangementInstallateur,
      ),
    )
    .with({ type: 'ChangementDispositifDeStockageEnregistré-V1' }, (readmodel) =>
      mapToDispositifDeStockageEnregistréTimelineItemsProps(
        readmodel,
        permissionConsulterChangementDispositifDeStockage,
      ),
    )
    .exhaustive();

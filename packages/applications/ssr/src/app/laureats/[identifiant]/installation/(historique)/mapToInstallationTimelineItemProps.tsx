import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToInstallateurModifiéTimelineItemsProps } from './events/mapToInstallateurModifiéTimelineItemsProps';
import { mapToInstallationImportéeTimelineItemProps } from './events/mapToInstallationImportéeTimelineItemProps';
import { mapToTypologieInstallationModifiéeTimelineItemsProps } from './events/mapToTypologieInstallationModifiéeTimelineItemsProps';
import { mapToDispositifDeStockageModifiéTimelineItemsProps } from './events/mapToDispositifDeStockageModifiéTimelineItemsProps';
import { mapToChangementInstallateurEnregistréTimelineItemsProps } from './events/mapToChangementInstallateurEnregistréTimelineItemsProps';

type MapToInstallationTimelineItemProps = (
  readmodel: Lauréat.Installation.HistoriqueInstallationProjetListItemReadModel,
) => TimelineItemProps;

export const mapToInstallationTimelineItemProps: MapToInstallationTimelineItemProps = (readmodel) =>
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
      mapToChangementInstallateurEnregistréTimelineItemsProps(readmodel),
    )
    .with({ type: 'ChangementDispositifDeStockageEnregistré-V1' }, (readmodel) =>
      mapToDispositifDeStockageModifiéTimelineItemsProps(readmodel),
    )
    .exhaustive();

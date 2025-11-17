import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToDispositifDeStockageModifiéTimelineItemsProps } from '../../../../(historique)/events/mapToDispositifDeStockageModifiéTimelineItemsProps';

import { mapToDispositifDeStockageImportéTimelineItemProps } from './events/mapToDispositifDeStockageImportéTimelineItemProps';

type MapToInstallationTimelineItemProps = (
  readmodel: Lauréat.Installation.HistoriqueInstallationProjetListItemReadModel,
) => TimelineItemProps | null;

export const mapToDispositifDeStockageTimelineItemProps: MapToInstallationTimelineItemProps = (
  readmodel,
) =>
  match(readmodel)
    .with({ type: 'InstallationImportée-V1' }, (readmodel) =>
      mapToDispositifDeStockageImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'DispositifDeStockageModifié-V1' }, (readmodel) =>
      mapToDispositifDeStockageModifiéTimelineItemsProps(readmodel),
    )
    .with({ type: 'ChangementDispositifDeStockageEnregistré-V1' }, (readmodel) =>
      mapToDispositifDeStockageModifiéTimelineItemsProps(readmodel),
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

import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline/TimelineItem';

import {
  mapToInstallationAvecDispositifDeStockageImportéTimelineItemProps,
  mapToinstallationAvecDispositifDeStockageModifiéeTimelineItemsProps,
} from './events';

export const mapToInstallationAvecDispositifDeStockageProps = (
  readmodel: Lauréat.InstallationAvecDispositifDeStockage.HistoriqueInstallationAvecDispositifDeStockageProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with({ type: 'InstallationAvecDispositifDeStockageImportée-V1' }, (readmodel) =>
      mapToInstallationAvecDispositifDeStockageImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'InstallationAvecDispositifDeStockageModifiée-V1' }, (readmodel) =>
      mapToinstallationAvecDispositifDeStockageModifiéeTimelineItemsProps(readmodel),
    )

    .exhaustive();

import { match, P } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToInstallateurModifiéTimelineItemsProps } from '../../../../(historique)/events/mapToInstallateurModifiéTimelineItemsProps';
import { mapToChangementInstallateurEnregistréTimelineItemsProps } from '../../../../(historique)/events/mapToChangementInstallateurEnregistréTimelineItemsProps';

import { mapToInstallateurImportéTimelineItemProps } from './events/mapToInstallateurImportéTimelineItemProps';

type MapToInstallateurTimelineItemProps = (
  readmodel: Lauréat.Installation.HistoriqueInstallationProjetListItemReadModel,
) => TimelineItemProps | null;

export const mapToInstallateurTimelineItemProps: MapToInstallateurTimelineItemProps = (readmodel) =>
  match(readmodel)
    .with({ type: 'InstallationImportée-V1' }, (readmodel) =>
      mapToInstallateurImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'InstallateurModifié-V1' }, (readmodel) =>
      mapToInstallateurModifiéTimelineItemsProps(readmodel),
    )
    .with({ type: 'ChangementInstallateurEnregistré-V1' }, (readmodel) =>
      mapToChangementInstallateurEnregistréTimelineItemsProps(readmodel),
    )
    .with(
      {
        type: P.union(
          'DispositifDeStockageModifié-V1',
          'TypologieInstallationModifiée-V1',
          'ChangementDispositifDeStockageEnregistré-V1',
        ),
      },
      () => null,
    )
    .exhaustive();

import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import {
  mapToInstallationImportéeTimelineItemProps,
  mapToInstallateurModifiéTimelineItemsProps,
} from './events';
import { mapToTypologieInstallationModifiéeTimelineItemsProps } from './events/mapToTypologieInstallationModifiéeTimelineItemsProps';

export const mapToInstallationTimelineItemProps = (
  readmodel: Lauréat.Installation.HistoriqueInstallationProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with({ type: 'InstallationImportée-V1' }, (readmodel) =>
      mapToInstallationImportéeTimelineItemProps(readmodel),
    )
    .with({ type: 'InstallateurModifié-V1' }, (readmodel) =>
      mapToInstallateurModifiéTimelineItemsProps(readmodel),
    )
    .with({ type: 'TypologieInstallationModifiée-V1' }, (readmodel) =>
      mapToTypologieInstallationModifiéeTimelineItemsProps(readmodel),
    )
    .exhaustive();

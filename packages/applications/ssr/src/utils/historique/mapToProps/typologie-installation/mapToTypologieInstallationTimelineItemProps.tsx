import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import { mapToTypologieInstallationImportéeTimelineItemProps } from './events/mapToTypologieInstallationImportéeTimelineItemProps';
import { mapToTypologieInstallationModifiéeTimelineItemsProps } from './events/mapToTypologieInstallationModifiéeTimelineItemsProps';

export const mapToTypologieInstallationTimelineItemProps = (
  readmodel: Lauréat.Installation.HistoriqueTypologieInstallationProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with({ type: 'InstallationImportée-V1' }, (readmodel) =>
      mapToTypologieInstallationImportéeTimelineItemProps(readmodel),
    )
    .with({ type: 'TypologieInstallationModifiée-V1' }, (readmodel) =>
      mapToTypologieInstallationModifiéeTimelineItemsProps(readmodel),
    )
    .exhaustive();

import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import {
  mapToInstallateurImportéTimelineItemProps,
  mapToInstallateurModifiéTimelineItemsProps,
} from './events';

export const mapToInstallateurTimelineItemProps = (
  readmodel: Lauréat.Installateur.HistoriqueInstallateurProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with({ type: 'InstallateurImporté-V1' }, (readmodel) =>
      mapToInstallateurImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'InstallateurModifié-V1' }, (readmodel) =>
      mapToInstallateurModifiéTimelineItemsProps(readmodel),
    )

    .exhaustive();

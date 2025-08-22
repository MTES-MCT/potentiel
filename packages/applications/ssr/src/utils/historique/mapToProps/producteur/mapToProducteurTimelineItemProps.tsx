import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/Timeline';
import { mapToChangementProducteurEnregistréTimelineItemProps } from './events/mapToChangementProducteurEnregistréTimelineItemProps';
import { mapToProducteurImportéTimelineItemProps } from './events/mapToProducteurImportéTimelineItemProps';
import { mapToProducteurModifiéTimelineItemsProps } from './events/mapToProducteurModifiéTimelineItemsProps';

export const mapToProducteurTimelineItemProps = (
  readmodel: Lauréat.Producteur.HistoriqueProducteurProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with({ type: 'ProducteurImporté-V1' }, (readmodel) =>
      mapToProducteurImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'ProducteurModifié-V1' }, (readmodel) =>
      mapToProducteurModifiéTimelineItemsProps(readmodel),
    )
    .with({ type: 'ChangementProducteurEnregistré-V1' }, (readmodel) =>
      mapToChangementProducteurEnregistréTimelineItemProps(readmodel),
    )
    .exhaustive();

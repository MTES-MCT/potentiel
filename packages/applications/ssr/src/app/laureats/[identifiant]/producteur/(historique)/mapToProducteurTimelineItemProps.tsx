import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { mapToChangementProducteurEnregistréTimelineItemProps } from './events/mapToChangementProducteurEnregistréTimelineItemProps';
import { mapToProducteurImportéTimelineItemProps } from './events/mapToProducteurImportéTimelineItemProps';
import { mapToProducteurModifiéTimelineItemsProps } from './events/mapToProducteurModifiéTimelineItemsProps';

type MapToProducteurTimelineItemProps = (
  readmodel: Lauréat.Producteur.HistoriqueProducteurProjetListItemReadModel,
) => TimelineItemProps;

export const mapToProducteurTimelineItemProps: MapToProducteurTimelineItemProps = (readmodel) =>
  match(readmodel)
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

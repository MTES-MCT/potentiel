import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToChangementProducteurEnregistréTimelineItemProps } from './events/mapToChangementProducteurEnregistréTimelineItemProps';
import { mapToProducteurModifiéTimelineItemsProps } from './events/mapToProducteurModifiéTimelineItemsProps';
import { mapToProducteurImportéTimelineItemProps } from './events/mapToProducteurImportéTimelineItemProps';

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

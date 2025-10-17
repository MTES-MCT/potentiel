import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import {
  mapToDispositifDeStockageImportéTimelineItemProps,
  mapTodispositifDeStockagemodifiéTimelineItemsProps,
} from './events';

type MapToDispositifDeStockageProps = (
  readmodel: Lauréat.DispositifDeStockage.HistoriqueDispositifDeStockageProjetListItemReadModel,
) => TimelineItemProps;

export const mapToDispositifDeStockageProps: MapToDispositifDeStockageProps = (readmodel) =>
  match(readmodel)
    .with({ type: 'DispositifDeStockageImporté-V1' }, (readmodel) =>
      mapToDispositifDeStockageImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'DispositifDeStockageModifié-V1' }, (readmodel) =>
      mapTodispositifDeStockagemodifiéTimelineItemsProps(readmodel),
    )
    .exhaustive();

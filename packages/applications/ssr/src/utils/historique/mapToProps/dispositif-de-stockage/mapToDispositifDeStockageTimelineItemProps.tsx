import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';

import {
  mapToDispositifDeStockageImportéTimelineItemProps,
  mapTodispositifDeStockagemodifiéTimelineItemsProps,
} from './events';

export const mapToDispositifDeStockageProps = (
  readmodel: Lauréat.DispositifDeStockage.HistoriqueDispositifDeStockageProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with({ type: 'DispositifDeStockageImporté-V1' }, (readmodel) =>
      mapToDispositifDeStockageImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'DispositifDeStockageModifié-V1' }, (readmodel) =>
      mapTodispositifDeStockagemodifiéTimelineItemsProps(readmodel),
    )

    .exhaustive();

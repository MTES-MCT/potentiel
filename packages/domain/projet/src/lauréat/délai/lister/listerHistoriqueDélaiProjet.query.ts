import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { DélaiEvent } from '../délai.event';
import { isFonctionnalitéDélaiActivée } from '../isFonctionnalitéDélaiActivée';
import { LegacyDélaiAccordéEvent } from '../accorder/accorderDélai.event';

export type ListerDélaiAccordéProjetPort = (
  identifiantProjet: string,
) => Promise<Array<HistoriqueDélaiProjetListItemReadModel>>;

export type HistoriqueDélaiProjetListItemReadModel = HistoryRecord<
  'délai',
  DélaiEvent | LegacyDélaiAccordéEvent
>;

export type ListerHistoriqueDélaiProjetReadModel = {
  items: ReadonlyArray<HistoriqueDélaiProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueDélaiProjetQuery = Message<
  'Lauréat.Délai.Query.ListerHistoriqueDélaiProjet',
  {
    identifiantProjet: string;
  },
  ListerHistoriqueDélaiProjetReadModel
>;

export type ListerHistoriqueDélaiProjetDependencies = {
  listerDélaiAccordéProjet: ListerDélaiAccordéProjetPort;
  listHistory: ListHistory<HistoriqueDélaiProjetListItemReadModel>;
};

export const registerListerHistoriqueDélaiProjetQuery = ({
  listerDélaiAccordéProjet,
  listHistory,
}: ListerHistoriqueDélaiProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueDélaiProjetQuery> = async ({
    identifiantProjet,
  }) => {
    if (isFonctionnalitéDélaiActivée()) {
      return listHistory({
        id: identifiantProjet,
        category: 'délai',
      });
    }

    const legacyHistorique = await listerDélaiAccordéProjet(identifiantProjet);

    return {
      items: legacyHistorique,
      range: {
        startPosition: 0,
        endPosition: legacyHistorique.length,
      },
      total: legacyHistorique.length,
    };
  };

  mediator.register('Lauréat.Délai.Query.ListerHistoriqueDélaiProjet', handler);
};

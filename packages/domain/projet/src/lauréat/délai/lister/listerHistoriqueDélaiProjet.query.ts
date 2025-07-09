import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord } from '@potentiel-domain/entity';

import { DélaiEvent } from '../délai.events';

export type ListerDélaiAccordéProjetPort = (
  identifiantProjet: string,
) => Promise<Array<HistoriqueDélaiProjetListItemReadModel>>;

export type HistoriqueDélaiProjetListItemReadModel = HistoryRecord<'délai', DélaiEvent>;

export type ListerHistoriqueDélaiProjetReadModel = Array<HistoriqueDélaiProjetListItemReadModel>;

export type ListerHistoriqueDélaiProjetQuery = Message<
  'Lauréat.Délai.Query.ListerHistoriqueDélaiProjet',
  {
    identifiantProjet: string;
  },
  ListerHistoriqueDélaiProjetReadModel
>;

export type ListerHistoriqueDélaiProjetDependencies = {
  listerDélaiAccordé: ListerDélaiAccordéProjetPort;
};

export const registerListerHistoriqueDélaiProjetQuery = ({
  listerDélaiAccordé,
}: ListerHistoriqueDélaiProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueDélaiProjetQuery> = async ({
    identifiantProjet,
  }) => {
    const items = await listerDélaiAccordé(identifiantProjet);
    return items;
  };

  mediator.register('Lauréat.Délai.Query.ListerHistoriqueDélaiProjet', handler);
};

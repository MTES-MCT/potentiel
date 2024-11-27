import { Message, MessageHandler, mediator } from 'mediateur';

import { ListHistory, ListHistoryResult, RangeOptions } from '@potentiel-domain/entity';

export type ListerHistoriqueProjetReadModel = ListHistoryResult;

export type ListerHistoriqueProjetQuery = Message<
  'Document.Query.ConsulterDocumentProjet',
  {
    identifiantProjet: string;
    category?: 'abandon';
    range: RangeOptions;
  },
  ListerHistoriqueProjetReadModel
>;

export type ListerHistoriqueProjetDependencies = {
  listHistory: ListHistory;
};

export const registerListerHistoriqueProjetQuery = ({
  listHistory,
}: ListerHistoriqueProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueProjetQuery> = listHistory;
  mediator.register('Document.Query.ConsulterDocumentProjet', handler);
};

import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { FournisseurEvent } from '../fournisseur.event.js';

export type HistoriqueFournisseurProjetListItemReadModel = HistoryRecord<
  'fournisseur',
  FournisseurEvent
>;

export type ListerHistoriqueFournisseurProjetReadModel = {
  items: ReadonlyArray<HistoriqueFournisseurProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueFournisseurProjetQuery = Message<
  'Lauréat.Fournisseur.Query.ListerHistoriqueFournisseurProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueFournisseurProjetReadModel
>;

export type ListerHistoriqueFournisseurProjetDependencies = {
  listHistory: ListHistory<HistoriqueFournisseurProjetListItemReadModel>;
};

export const registerListerHistoriqueFournisseurProjetQuery = ({
  listHistory,
}: ListerHistoriqueFournisseurProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueFournisseurProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'fournisseur',
      range,
    });

  mediator.register('Lauréat.Fournisseur.Query.ListerHistoriqueFournisseurProjet', handler);
};

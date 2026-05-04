import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { PowerPurchaseAgreementEvents } from '../PowerPurchaseAgreement.events.js';

export type HistoriquePowerPurchaseAgreementProjetListItemReadModel = HistoryRecord<
  'power-purchase-agreement',
  PowerPurchaseAgreementEvents
>;

export type ListerHistoriquePowerPurchaseAgreementProjetReadModel = {
  items: ReadonlyArray<HistoriquePowerPurchaseAgreementProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriquePowerPurchaseAgreementProjetQuery = Message<
  'Lauréat.PowerPurchaseAgreement.Query.ListerHistoriquePowerPurchaseAgreementProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriquePowerPurchaseAgreementProjetReadModel
>;

export type ListerHistoriquePowerPurchaseAgreementProjetDependencies = {
  listHistory: ListHistory<HistoriquePowerPurchaseAgreementProjetListItemReadModel>;
};

export const registerListerHistoriquePowerPurchaseAgreementProjetQuery = ({
  listHistory,
}: ListerHistoriquePowerPurchaseAgreementProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriquePowerPurchaseAgreementProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'power-purchase-agreement',
      range,
    });

  mediator.register(
    'Lauréat.PowerPurchaseAgreement.Query.ListerHistoriquePowerPurchaseAgreementProjet',
    handler,
  );
};

import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { InstallationAvecDispositifDeStockageEvent } from '../installationAvecDispositifDeStockage.event';

export type HistoriqueInstallationAvecDispositifDeStockageProjetListItemReadModel = HistoryRecord<
  'installation-avec-dispositif-de-stockage',
  InstallationAvecDispositifDeStockageEvent
>;

export type ListerHistoriqueInstallationAvecDispositifDeStockageProjetReadModel = {
  items: ReadonlyArray<HistoriqueInstallationAvecDispositifDeStockageProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueInstallationAvecDispositifDeStockageProjetQuery = Message<
  'Lauréat.InstallationAvecDispositifDeStockage.Query.ListerHistoriqueInstallationAvecDispositifDeStockageProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueInstallationAvecDispositifDeStockageProjetReadModel
>;

export type ListerHistoriqueInstallationAvecDispositifDeStockageProjetDependencies = {
  listHistory: ListHistory<HistoriqueInstallationAvecDispositifDeStockageProjetListItemReadModel>;
};

export const registerListerHistoriqueInstallationAvecDispositifDeStockageProjetQuery = ({
  listHistory,
}: ListerHistoriqueInstallationAvecDispositifDeStockageProjetDependencies) => {
  const handler: MessageHandler<
    ListerHistoriqueInstallationAvecDispositifDeStockageProjetQuery
  > = ({ identifiantProjet, range }) =>
    listHistory({
      id: identifiantProjet,
      category: 'installation-avec-dispositif-de-stockage',
      range,
    });

  mediator.register(
    'Lauréat.InstallationAvecDispositifDeStockage.Query.ListerHistoriqueInstallationAvecDispositifDeStockageProjet',
    handler,
  );
};

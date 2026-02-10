import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { InstallationEvent } from '../installation.event.js';

export type HistoriqueInstallationProjetListItemReadModel = HistoryRecord<
  'installation',
  InstallationEvent
>;

export type ListerHistoriqueInstallationProjetReadModel = {
  items: ReadonlyArray<HistoriqueInstallationProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueInstallationProjetQuery = Message<
  'Lauréat.Installation.Query.ListerHistoriqueInstallationProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueInstallationProjetReadModel
>;

export type ListerHistoriqueInstallationProjetDependencies = {
  listHistory: ListHistory<HistoriqueInstallationProjetListItemReadModel>;
};

export const registerListerHistoriqueInstallationProjetQuery = ({
  listHistory,
}: ListerHistoriqueInstallationProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueInstallationProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'installation',
      range,
    });

  mediator.register('Lauréat.Installation.Query.ListerHistoriqueInstallationProjet', handler);
};

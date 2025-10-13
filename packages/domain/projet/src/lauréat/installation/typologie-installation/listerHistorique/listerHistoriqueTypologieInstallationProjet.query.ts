import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord, ListHistory, RangeOptions } from '@potentiel-domain/entity';

import { TypologieInstallationEvent } from '../typologieInstallation.event';

export type HistoriqueTypologieInstallationProjetListItemReadModel = HistoryRecord<
  'typologie-installation',
  TypologieInstallationEvent
>;

export type ListerHistoriqueTypologieInstallationProjetReadModel = {
  items: ReadonlyArray<HistoriqueTypologieInstallationProjetListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerHistoriqueTypologieInstallationProjetQuery = Message<
  'Lauréat.Installation.Query.ListerHistoriqueTypologieInstallationProjet',
  {
    identifiantProjet: string;
    range?: RangeOptions;
  },
  ListerHistoriqueTypologieInstallationProjetReadModel
>;

export type ListerHistoriqueTypologieInstallationProjetDependencies = {
  listHistory: ListHistory<HistoriqueTypologieInstallationProjetListItemReadModel>;
};

export const registerListerHistoriqueTypologieInstallationProjetQuery = ({
  listHistory,
}: ListerHistoriqueTypologieInstallationProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueTypologieInstallationProjetQuery> = ({
    identifiantProjet,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category: 'typologie-installation',
      range,
    });

  mediator.register(
    'Lauréat.Installation.Query.ListerHistoriqueTypologieInstallationProjet',
    handler,
  );
};

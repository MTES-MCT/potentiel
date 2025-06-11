import { Message, MessageHandler, mediator } from 'mediateur';

import {
  HistoryRecord,
  ListHistory,
  ListHistoryResult,
  RangeOptions,
} from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { HistoriqueRecoursProjetListItemReadModel } from './listerHistoriqueRecoursProjet.query';
import { HistoriqueAbandonProjetListItemReadModel } from './listerHistoriqueAbandonProjet.query';
import { HistoriqueActionnaireProjetListItemReadModel } from './listerHistoriqueActionnaireProjet.query';
import { HistoriqueReprésentantLégalProjetListItemReadModel } from './listerHistoriqueReprésentantLégalProjet.query';
import { HistoriquePuissanceProjetListItemReadModel } from './listerHistoriquePuissanceProjet.query';

export type HistoriqueLauréatProjetListItemReadModel = HistoryRecord<
  'lauréat',
  Lauréat.LauréatEvent['type'],
  Lauréat.LauréatEvent['payload']
>;

export type HistoriqueGarantiesFinancièresProjetListItemReadModel = HistoryRecord<
  'garanties-financieres',
  GarantiesFinancières.GarantiesFinancièresEvent['type'],
  GarantiesFinancières.GarantiesFinancièresEvent['payload']
>;

export type HistoriqueListItemReadModels =
  | HistoriqueLauréatProjetListItemReadModel
  | HistoriqueAbandonProjetListItemReadModel
  | HistoriqueActionnaireProjetListItemReadModel
  | HistoriqueRecoursProjetListItemReadModel
  | HistoriqueReprésentantLégalProjetListItemReadModel
  | HistoriqueGarantiesFinancièresProjetListItemReadModel
  | HistoriquePuissanceProjetListItemReadModel;

export type ListerHistoriqueProjetReadModel = ListHistoryResult<HistoriqueListItemReadModels>;

export type ListerHistoriqueProjetQuery = Message<
  'Historique.Query.ListerHistoriqueProjet',
  {
    identifiantProjet: string;
    category?: HistoriqueListItemReadModels['category'];
    range?: RangeOptions;
  },
  ListerHistoriqueProjetReadModel
>;

export type ListerHistoriqueProjetDependencies = {
  listHistory: ListHistory<HistoriqueListItemReadModels>;
};

export const registerListerHistoriqueProjetQuery = ({
  listHistory,
}: ListerHistoriqueProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueProjetQuery> = ({
    identifiantProjet,
    category,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category,
      range,
    });
  mediator.register('Historique.Query.ListerHistoriqueProjet', handler);
};

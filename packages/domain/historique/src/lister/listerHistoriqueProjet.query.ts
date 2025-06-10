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

export type ListerHistoriqueProjetReadModel<TRecord extends HistoryRecord = HistoryRecord> =
  ListHistoryResult<TRecord>;

export type LauréatHistoryRecord = HistoryRecord<
  'lauréat',
  Lauréat.LauréatEvent['type'],
  Lauréat.LauréatEvent['payload']
>;

export type GarantiesFinancièresHistoryRecord = HistoryRecord<
  'garanties-financieres',
  GarantiesFinancières.GarantiesFinancièresEvent['type'],
  GarantiesFinancières.GarantiesFinancièresEvent['payload']
>;

export type HistoryReadModel =
  | LauréatHistoryRecord
  | HistoriqueAbandonProjetListItemReadModel
  | HistoriqueActionnaireProjetListItemReadModel
  | HistoriqueRecoursProjetListItemReadModel
  | HistoriqueReprésentantLégalProjetListItemReadModel
  | GarantiesFinancièresHistoryRecord;

export type ListerHistoriqueProjetQuery<TRecord extends HistoryRecord = HistoryRecord> = Message<
  'Historique.Query.ListerHistoriqueProjet',
  {
    identifiantProjet: string;
    category?: HistoryReadModel['category'];
    range?: RangeOptions;
  },
  ListerHistoriqueProjetReadModel<TRecord>
>;

export type ListerHistoriqueProjetDependencies = {
  listHistory: ListHistory<HistoryReadModel>;
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

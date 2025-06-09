import { Message, MessageHandler, mediator } from 'mediateur';

import {
  HistoryRecord,
  ListHistory,
  ListHistoryResult,
  RangeOptions,
} from '@potentiel-domain/entity';
import { Lauréat, Éliminé } from '@potentiel-domain/projet';
import { Actionnaire, GarantiesFinancières, ReprésentantLégal } from '@potentiel-domain/laureat';

export type ListerHistoriqueProjetReadModel<TRecord extends HistoryRecord = HistoryRecord> =
  ListHistoryResult<TRecord>;

export type AbandonHistoryRecord = HistoryRecord<
  'abandon',
  Lauréat.Abandon.AbandonEvent['type'],
  Lauréat.Abandon.AbandonEvent['payload']
>;

export type RecoursHistoryRecord = HistoryRecord<
  'recours',
  Éliminé.Recours.RecoursEvent['type'],
  Éliminé.Recours.RecoursEvent['payload']
>;

export type ActionnaireHistoryRecord = HistoryRecord<
  'actionnaire',
  Actionnaire.ActionnaireEvent['type'],
  Actionnaire.ActionnaireEvent['payload']
>;

export type ReprésentantLégalHistoryRecord = HistoryRecord<
  'représentant-légal',
  ReprésentantLégal.ReprésentantLégalEvent['type'],
  ReprésentantLégal.ReprésentantLégalEvent['payload']
>;

export type ProducteurHistoryRecord = HistoryRecord<
  'producteur',
  Lauréat.Producteur.ProducteurEvent['type'],
  Lauréat.Producteur.ProducteurEvent['payload']
>;

export type PuissanceHistoryRecord = HistoryRecord<
  'puissance',
  Lauréat.Puissance.PuissanceEvent['type'],
  Lauréat.Puissance.PuissanceEvent['payload']
>;

export type LauréatHistoryRecord = HistoryRecord<
  'lauréat',
  Lauréat.LauréatEvent['type'],
  Lauréat.LauréatEvent['payload']
>;

export type GarantiesFinancièresHistoryRecord = HistoryRecord<
  'garanties-financières',
  GarantiesFinancières.GarantiesFinancièresEvent['type'],
  GarantiesFinancières.GarantiesFinancièresEvent['payload']
>;

export type HistoryReadModel =
  | LauréatHistoryRecord
  | AbandonHistoryRecord
  | ActionnaireHistoryRecord
  | RecoursHistoryRecord
  | ReprésentantLégalHistoryRecord
  | GarantiesFinancièresHistoryRecord;

export type ListerHistoriqueProjetQuery<TRecord extends HistoryRecord = HistoryRecord> = Message<
  'Historique.Query.ListerHistoriqueProjet',
  {
    identifiantProjet: string;
    category?: TRecord['category'];
    range?: RangeOptions;
  },
  ListerHistoriqueProjetReadModel<TRecord>
>;

export type ListerHistoriqueProjetDependencies = {
  listHistory: ListHistory;
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

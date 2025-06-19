import { Message, MessageHandler, mediator } from 'mediateur';

import {
  HistoryRecord,
  ListHistory,
  ListHistoryResult,
  RangeOptions,
} from '@potentiel-domain/entity';
import { Lauréat, Éliminé } from '@potentiel-domain/projet';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { HistoriqueRaccordementProjetListItemReadModel } from './listerHistoriqueRaccordementProjet.query';

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

export type HistoriqueAchèvementProjetListItemReadModel = HistoryRecord<
  'achevement',
  Lauréat.Achèvement.AchèvementEvent['type'],
  Lauréat.Achèvement.AchèvementEvent['payload']
>;

export type HistoriqueListItemReadModels =
  | Lauréat.Abandon.HistoriqueAbandonProjetListItemReadModel
  | HistoriqueLauréatProjetListItemReadModel
  | Lauréat.Actionnaire.HistoriqueActionnaireProjetListItemReadModel
  | Éliminé.Recours.HistoriqueRecoursProjetListItemReadModel
  | Lauréat.ReprésentantLégal.HistoriqueReprésentantLégalProjetListItemReadModel
  | HistoriqueGarantiesFinancièresProjetListItemReadModel
  | Lauréat.Puissance.HistoriquePuissanceProjetListItemReadModel
  | Lauréat.Producteur.HistoriqueProducteurProjetListItemReadModel
  | HistoriqueAchèvementProjetListItemReadModel
  | HistoriqueRaccordementProjetListItemReadModel;

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

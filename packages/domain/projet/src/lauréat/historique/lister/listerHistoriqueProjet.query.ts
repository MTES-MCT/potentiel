import { type Message, type MessageHandler, mediator } from 'mediateur';

import type {
  HistoryRecord,
  ListHistory,
  ListHistoryResult,
  RangeOptions,
} from '@potentiel-domain/entity';

import type { HistoriqueRecoursProjetListItemReadModel } from '../../../éliminé/recours';
import type { HistoriqueAbandonProjetListItemReadModel } from '../../abandon';
import type { AchèvementEvent } from '../../achèvement';
import type { HistoriqueActionnaireProjetListItemReadModel } from '../../actionnaire';
import type { HistoriqueDélaiProjetListItemReadModel } from '../../délai';
import type { HistoriqueFournisseurProjetListItemReadModel } from '../../fournisseur';
import type { GarantiesFinancièresEvent } from '../../garanties-financières';
import type { LauréatEvent } from '../../lauréat.event';
import type { HistoriqueProducteurProjetListItemReadModel } from '../../producteur';
import type { HistoriquePuissanceProjetListItemReadModel } from '../../puissance';
import type { HistoriqueRaccordementProjetListItemReadModel } from '../../raccordement';
import type { HistoriqueReprésentantLégalProjetListItemReadModel } from '../../représentantLégal';

export type HistoriqueLauréatProjetListItemReadModel = HistoryRecord<'lauréat', LauréatEvent>;

export type HistoriqueGarantiesFinancièresProjetListItemReadModel = HistoryRecord<
  'garanties-financieres',
  GarantiesFinancièresEvent
>;

export type HistoriqueAchèvementProjetListItemReadModel = HistoryRecord<
  'achevement',
  AchèvementEvent
>;

export type HistoriqueListItemReadModels =
  | HistoriqueAbandonProjetListItemReadModel
  | HistoriqueLauréatProjetListItemReadModel
  | HistoriqueActionnaireProjetListItemReadModel
  | HistoriqueRecoursProjetListItemReadModel
  | HistoriqueReprésentantLégalProjetListItemReadModel
  | HistoriqueGarantiesFinancièresProjetListItemReadModel
  | HistoriquePuissanceProjetListItemReadModel
  | HistoriqueProducteurProjetListItemReadModel
  | HistoriqueAchèvementProjetListItemReadModel
  | HistoriqueRaccordementProjetListItemReadModel
  | HistoriqueDélaiProjetListItemReadModel
  | HistoriqueFournisseurProjetListItemReadModel;

export type ListerHistoriqueProjetReadModel = ListHistoryResult<HistoriqueListItemReadModels>;

export type ListerHistoriqueProjetQuery = Message<
  'Lauréat.Query.ListerHistoriqueProjet',
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
  const handler: MessageHandler<ListerHistoriqueProjetQuery> = async ({
    identifiantProjet,
    category,
    range,
  }) =>
    listHistory({
      id: identifiantProjet,
      category,
      range,
    });

  mediator.register('Lauréat.Query.ListerHistoriqueProjet', handler);
};

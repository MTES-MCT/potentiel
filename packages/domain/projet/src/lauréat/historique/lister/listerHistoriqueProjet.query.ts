import { Message, MessageHandler, mediator } from 'mediateur';

import {
  HistoryRecord,
  ListHistory,
  ListHistoryResult,
  RangeOptions,
} from '@potentiel-domain/entity';

import { HistoriqueRecoursProjetListItemReadModel } from '../../../éliminé/recours';
import { HistoriqueAbandonProjetListItemReadModel } from '../../abandon';
import { AchèvementEvent } from '../../achèvement';
import { HistoriqueActionnaireProjetListItemReadModel } from '../../actionnaire';
import { GarantiesFinancièresEvent } from '../../garanties-financières';
import { LauréatEvent } from '../../lauréat.event';
import { HistoriqueProducteurProjetListItemReadModel } from '../../producteur';
import { HistoriquePuissanceProjetListItemReadModel } from '../../puissance';
import { HistoriqueRaccordementProjetListItemReadModel } from '../../raccordement';
import { HistoriqueReprésentantLégalProjetListItemReadModel } from '../../représentantLégal';
import { HistoriqueDélaiProjetListItemReadModel } from '../../délai';

export type HistoriqueLauréatProjetListItemReadModel = HistoryRecord<
  'lauréat',
  LauréatEvent['type'],
  LauréatEvent['payload']
>;

export type HistoriqueGarantiesFinancièresProjetListItemReadModel = HistoryRecord<
  'garanties-financieres',
  GarantiesFinancièresEvent['type'],
  GarantiesFinancièresEvent['payload']
>;

export type HistoriqueAchèvementProjetListItemReadModel = HistoryRecord<
  'achevement',
  AchèvementEvent['type'],
  AchèvementEvent['payload']
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
  | HistoriqueDélaiProjetListItemReadModel;

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
  mediator.register('Lauréat.Query.ListerHistoriqueProjet', handler);
};

import { type Message, type MessageHandler, mediator } from 'mediateur';

import type {
  HistoryRecord,
  ListHistory,
  ListHistoryResult,
  RangeOptions,
} from '@potentiel-domain/entity';

import type { ÉliminéEvent } from '../../../éliminé/index.js';
import type { HistoriqueRecoursProjetListItemReadModel } from '../../../éliminé/recours/index.js';
import type { HistoriqueAbandonProjetListItemReadModel } from '../../abandon/index.js';
import type { AchèvementEvent } from '../../achèvement/index.js';
import type { HistoriqueActionnaireProjetListItemReadModel } from '../../actionnaire/index.js';
import type { HistoriqueDélaiProjetListItemReadModel } from '../../délai/index.js';
import type { HistoriqueFournisseurProjetListItemReadModel } from '../../fournisseur/index.js';
import type { GarantiesFinancièresEvent } from '../../garanties-financières/index.js';
import type { HistoriqueInstallationProjetListItemReadModel } from '../../installation/index.js';
import type { LauréatEvent } from '../../lauréat.event.js';
import type { HistoriqueNatureDeLExploitationProjetListItemReadModel } from '../../nature-de-l-exploitation/index.js';
import type { HistoriquePowerPurchaseAgreementProjetListItemReadModel } from '../../power-purchase-agreement/index.js';
import type { HistoriqueProducteurProjetListItemReadModel } from '../../producteur/index.js';
import type { HistoriquePuissanceProjetListItemReadModel } from '../../puissance/index.js';
import type { HistoriqueRaccordementProjetListItemReadModel } from '../../raccordement/index.js';
import type { HistoriqueReprésentantLégalProjetListItemReadModel } from '../../représentantLégal/index.js';

export type HistoriqueLauréatProjetListItemReadModel = HistoryRecord<'lauréat', LauréatEvent>;
export type HistoriqueÉliminéProjetListItemReadModel = HistoryRecord<'éliminé', ÉliminéEvent>;

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
  | HistoriqueÉliminéProjetListItemReadModel
  | HistoriqueActionnaireProjetListItemReadModel
  | HistoriqueRecoursProjetListItemReadModel
  | HistoriqueReprésentantLégalProjetListItemReadModel
  | HistoriqueGarantiesFinancièresProjetListItemReadModel
  | HistoriquePuissanceProjetListItemReadModel
  | HistoriqueProducteurProjetListItemReadModel
  | HistoriqueAchèvementProjetListItemReadModel
  | HistoriqueRaccordementProjetListItemReadModel
  | HistoriqueDélaiProjetListItemReadModel
  | HistoriqueFournisseurProjetListItemReadModel
  | HistoriqueInstallationProjetListItemReadModel
  | HistoriqueNatureDeLExploitationProjetListItemReadModel
  | HistoriquePowerPurchaseAgreementProjetListItemReadModel;

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

import { Message, MessageHandler, mediator } from 'mediateur';

import {
  HistoryRecord,
  ListHistory,
  ListHistoryResult,
  RangeOptions,
} from '@potentiel-domain/entity';

import { HistoriqueRecoursProjetListItemReadModel } from '../../../éliminé/recours/index.js';
import { HistoriqueAbandonProjetListItemReadModel } from '../../abandon/index.js';
import { HistoriqueActionnaireProjetListItemReadModel } from '../../actionnaire/index.js';
import { GarantiesFinancièresEvent } from '../../garanties-financières/index.js';
import { LauréatEvent } from '../../lauréat.event.js';
import { HistoriqueProducteurProjetListItemReadModel } from '../../producteur/index.js';
import { HistoriquePuissanceProjetListItemReadModel } from '../../puissance/index.js';
import { HistoriqueRaccordementProjetListItemReadModel } from '../../raccordement/index.js';
import { HistoriqueReprésentantLégalProjetListItemReadModel } from '../../représentantLégal/index.js';
import { HistoriqueDélaiProjetListItemReadModel } from '../../délai/index.js';
import { HistoriqueFournisseurProjetListItemReadModel } from '../../fournisseur/index.js';
import { AchèvementEvent } from '../../achèvement/index.js';
import { ÉliminéEvent } from '../../../éliminé/index.js';
import { HistoriqueNatureDeLExploitationProjetListItemReadModel } from '../../nature-de-l-exploitation/index.js';
import { HistoriqueInstallationProjetListItemReadModel } from '../../installation/index.js';

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
  | HistoriqueNatureDeLExploitationProjetListItemReadModel;

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

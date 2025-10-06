import { Message, MessageHandler, mediator } from 'mediateur';

import {
  HistoryRecord,
  ListHistory,
  ListHistoryResult,
  RangeOptions,
} from '@potentiel-domain/entity';

import { HistoriqueRecoursProjetListItemReadModel } from '../../../éliminé/recours';
import { HistoriqueAbandonProjetListItemReadModel } from '../../abandon';
import { HistoriqueActionnaireProjetListItemReadModel } from '../../actionnaire';
import { GarantiesFinancièresEvent } from '../../garanties-financières';
import { LauréatEvent } from '../../lauréat.event';
import { HistoriqueProducteurProjetListItemReadModel } from '../../producteur';
import { HistoriquePuissanceProjetListItemReadModel } from '../../puissance';
import { HistoriqueRaccordementProjetListItemReadModel } from '../../raccordement';
import { HistoriqueReprésentantLégalProjetListItemReadModel } from '../../représentantLégal';
import { HistoriqueDélaiProjetListItemReadModel } from '../../délai';
import { HistoriqueFournisseurProjetListItemReadModel } from '../../fournisseur';
import { AchèvementEvent } from '../../achèvement';
import { ÉliminéEvent } from '../../../éliminé';
import { HistoriqueInstallationAvecDispositifDeStockageProjetListItemReadModel } from '../../installation-avec-dispositif-de-stockage/listerHistorique/ListerHistoriqueInstallationAvecDispositifDeStockageProjet.query';
import { HistoriqueNatureDeLExploitationProjetListItemReadModel } from '../../nature-de-l-exploitation';
import { HistoriqueInstallateurProjetListItemReadModel } from '../../installation';

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
  | HistoriqueInstallateurProjetListItemReadModel
  | HistoriqueInstallationAvecDispositifDeStockageProjetListItemReadModel
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

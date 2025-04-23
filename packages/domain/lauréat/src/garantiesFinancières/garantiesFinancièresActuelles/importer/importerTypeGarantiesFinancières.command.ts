import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadTâchePlanifiéeAggregateFactory } from '@potentiel-domain/tache-planifiee';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import * as TypeTâchePlanifiéeGarantiesFinancières from '../../typeTâchePlanifiéeGarantiesFinancières.valueType';

export type ImporterTypeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerImporterTypeGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);

  const handler: MessageHandler<ImporterTypeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    const projet = await getProjetAggregateRoot(identifiantProjet);
    projet.lauréat.vérifierQueLeLauréatExiste();

    const achèvement = await loadAchèvement(identifiantProjet, false);
    const tâchePlanifiéeEchoir = await loadTâchePlanifiée(
      TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
      identifiantProjet,
      false,
    );
    const tâchePlanifiéeRappel1mois = await loadTâchePlanifiée(
      TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois.type,
      identifiantProjet,
      false,
    );
    const tâchePlanifiéeRappel2mois = await loadTâchePlanifiée(
      TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois.type,
      identifiantProjet,
      false,
    );
    await garantiesFinancières.importerType({
      identifiantProjet,
      importéLe: projet.candidature.notifiéeLe,
      type: projet.candidature.typeGarantiesFinancières,
      dateÉchéance: projet.candidature.dateÉchéanceGf,
      estAchevé: achèvement.estAchevé(),
      tâchePlanifiéeEchoir,
      tâchePlanifiéeRappel1mois,
      tâchePlanifiéeRappel2mois,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
    handler,
  );
};

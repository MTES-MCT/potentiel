import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { loadTâchePlanifiéeAggregateFactory } from '@potentiel-domain/tache-planifiee';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { loadLauréatFactory } from '../../../lauréat.aggregate';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import * as TypeTâchePlanifiéeGarantiesFinancières from '../../typeTâchePlanifiéeGarantiesFinancières.valueType';

export type ImporterTypeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerImporterTypeGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadLauréat = loadLauréatFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);

  const handler: MessageHandler<ImporterTypeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    const candidature = await loadCandidature(identifiantProjet, false);
    const lauréat = await loadLauréat(identifiantProjet, false);
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
      importéLe: lauréat.notifiéLe,
      type: candidature.garantiesFinancières?.type,
      dateÉchéance: candidature.garantiesFinancières?.dateEchéance,
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

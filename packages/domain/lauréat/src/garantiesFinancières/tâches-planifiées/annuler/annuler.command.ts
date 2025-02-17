import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadTâchePlanifiéeAggregateFactory } from '@potentiel-domain/tache-planifiee';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import * as TypeTâchePlanifiéeGarantiesFinancières from '../../typeTâchePlanifiéeGarantiesFinancières.valueType';

export type AnnulerTâchesPlanifiéesGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.AnnulerTâchesPlanifiées',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerTâchesPlanifiéesCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);
  const handler: MessageHandler<AnnulerTâchesPlanifiéesGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
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
    await garantiesFinancières.annulerTâchesPlanifiées({
      tâchePlanifiéeEchoir,
      tâchePlanifiéeRappel1mois,
      tâchePlanifiéeRappel2mois,
    });
  };

  mediator.register('Lauréat.GarantiesFinancières.Command.AnnulerTâchesPlanifiées', handler);
};

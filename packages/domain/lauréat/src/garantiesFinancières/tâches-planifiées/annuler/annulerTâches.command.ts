import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadTâchePlanifiéeAggregateFactory } from '@potentiel-domain/tache-planifiee';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import * as TypeTâchePlanifiéeGarantiesFinancières from '../../typeTâchePlanifiéeGarantiesFinancières.valueType';

export type AnnulerTâchesGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.AnnulerTâches',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerTâchesCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);
  const handler: MessageHandler<AnnulerTâchesGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet);
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
    await garantiesFinancières.annulerTâches({
      tâchePlanifiéeEchoir,
      tâchePlanifiéeRappel1mois,
      tâchePlanifiéeRappel2mois,
    });
  };

  mediator.register('Lauréat.GarantiesFinancières.Command.AnnulerTâches', handler);
};

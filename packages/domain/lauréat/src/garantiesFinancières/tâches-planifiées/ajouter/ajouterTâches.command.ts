import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadTâchePlanifiéeAggregateFactory } from '@potentiel-domain/tache-planifiee';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import * as TypeTâchePlanifiéeGarantiesFinancières from '../../typeTâchePlanifiéeGarantiesFinancières.valueType';

export type AjouterTâchesGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.AjouterTâches',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateÉchéance?: DateTime.ValueType;
  }
>;

export const registerAjouterTâchesCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);
  const handler: MessageHandler<AjouterTâchesGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    dateÉchéance,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet);
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
    await garantiesFinancières.ajouterTâches({
      tâchePlanifiéeEchoir,
      tâchePlanifiéeRappel1mois,
      tâchePlanifiéeRappel2mois,
      dateÉchéance,
      estAchevé: achèvement.estAchevé(),
    });
  };

  mediator.register('Lauréat.GarantiesFinancières.Command.AjouterTâches', handler);
};

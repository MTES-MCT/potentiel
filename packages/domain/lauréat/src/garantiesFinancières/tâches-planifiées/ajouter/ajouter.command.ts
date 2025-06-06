import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadTâchePlanifiéeAggregateFactory } from '@potentiel-domain/tache-planifiee';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import * as TypeTâchePlanifiéeGarantiesFinancières from '../../typeTâchePlanifiéeGarantiesFinancières.valueType';

/**
 * @deprecated Cette commande est temporaire pour permettre l'appel au behavior,
 * qui à terme sera fait directement depuis le behavior appelant, via l'aggregate root.
 **/
export type AjouterTâchesPlanifiéesGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.AjouterTâchesPlanifiées',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateÉchéance?: DateTime.ValueType;
  }
>;

/** @deprecated */
export const registerAjouterTâchesPlanfiéesCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);

  const handler: MessageHandler<AjouterTâchesPlanifiéesGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    dateÉchéance,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
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
    await garantiesFinancières.ajouterTâchesPlanifiées({
      tâchePlanifiéeEchoir,
      tâchePlanifiéeRappel1mois,
      tâchePlanifiéeRappel2mois,
      dateÉchéance,
      estAchevé: projet.statut.estAchevé(),
    });
  };

  mediator.register('Lauréat.GarantiesFinancières.Command.AjouterTâchesPlanifiées', handler);
};

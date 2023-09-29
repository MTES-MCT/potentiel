import { Then as Alors } from '@cucumber/cucumber';

import { expect } from 'chai';
import { mediator } from 'mediateur';
import { ConsulterGestionnaireRéseauLauréatQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';

import { loadAggregate } from '@potentiel/pg-event-sourcing';
import {
  loadGestionnaireRéseauProjetAggregateFactory,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';
import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  `le projet {string} devrait avoir comme gestionnaire de réseau {string}`,
  async function (this: PotentielWorld, nomProjet: string, raisonSociale: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    // Assert on aggregate
    const actualProjetAggregate = await loadGestionnaireRéseauProjetAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(identifiantProjet));

    if (isNone(actualProjetAggregate)) {
      throw new Error(`L'agrégat projet n'existe pas !`);
    }

    const actualGestionnaireRéseau = await actualProjetAggregate.getGestionnaireRéseau();

    if (isNone(actualGestionnaireRéseau)) {
      throw new Error(`L'agrégat gestionnaire de réseau n'existe pas !`);
    }
    actualGestionnaireRéseau.codeEIC.should.equals(codeEIC);

    // Assert on read model
    const résultat = await mediator.send<ConsulterGestionnaireRéseauLauréatQuery>({
      type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_LAURÉAT_QUERY',
      data: {
        identifiantProjet,
      },
    });

    if (isNone(résultat)) {
      throw new Error('Projet non trouvé');
    }

    expect(résultat.identifiantGestionnaire).to.deep.equal({
      codeEIC,
    });
  },
);

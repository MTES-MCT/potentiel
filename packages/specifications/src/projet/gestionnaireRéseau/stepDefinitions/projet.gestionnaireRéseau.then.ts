import { Then as Alors } from '@cucumber/cucumber';

import { expect } from 'chai';
import { mediator } from 'mediateur';
import { ConsulterProjetQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';

import { PotentielWorld } from '../../../potentiel.world';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { loadProjetAggregateFactory, convertirEnIdentifiantProjet } from '@potentiel/domain';

Alors(
  `le projet {string} devrait avoir comme gestionnaire de réseau {string}`,
  async function (this: PotentielWorld, nomProjet: string, raisonSociale: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);
    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    // Assert on aggregate
    const actualProjetAggregate = await loadProjetAggregateFactory({ loadAggregate })(
      convertirEnIdentifiantProjet(identifiantProjet),
    );

    if (isNone(actualProjetAggregate)) {
      throw new Error(`L'agrégat projet n'existe pas !`);
    }

    const actualGestionnaireRéseau = await actualProjetAggregate.getGestionnaireRéseau();

    if (isNone(actualGestionnaireRéseau)) {
      throw new Error(`L'agrégat gestionnaire de réseau n'existe pas !`);
    }
    actualGestionnaireRéseau.codeEIC.should.equals(codeEIC);

    // Assert on read model
    const résultat = await mediator.send<ConsulterProjetQuery>({
      type: 'CONSULTER_PROJET',
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

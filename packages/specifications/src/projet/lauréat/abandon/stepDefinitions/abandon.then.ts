import { Then as Alors } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { convertirEnIdentifiantProjet, loadAbandonAggregateFactory } from '@potentiel/domain';
import { isNone } from '@potentiel/monads';

Alors(
  `la recandidature du projet {string} devrait être consultable dans la liste des projets lauréat abandonnés devant recandidater`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    // Assert de l'aggrégat
    const actualProjetAggregate = await loadAbandonAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(identifiantProjet));

    if (isNone(actualProjetAggregate)) {
      throw new Error(`L'agrégat abandon n'existe pas !`);
    }

    true.should.be.false;
  },
);

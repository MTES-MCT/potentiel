import { Then as Alors } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world';
import { loadAggregate } from '@potentiel/pg-event-sourcing';
import { convertirEnIdentifiantProjet, loadAbandonAggregateFactory } from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import { mediator } from 'mediateur';
import { ConsulterProjetQuery } from '@potentiel/domain-views/src/projet/consulter/consulterProjet.query';

Alors(
  `la recandidature du projet {string} devrait être consultable dans la liste des projets lauréat abandonnés devant recandidater`,
  async function (this: PotentielWorld, nomProjet: string) {
    const lauréat = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    // Assert de l'aggrégat
    const actualProjetAggregate = await loadAbandonAggregateFactory({
      loadAggregate,
    })(convertirEnIdentifiantProjet(lauréat.identifiantProjet));

    if (isNone(actualProjetAggregate)) {
      throw new Error(`L'agrégat abandon n'existe pas !`);
    }

    const actual = await mediator.send<ConsulterProjetQuery>({
      type: 'CONSULTER_PROJET',
      data: {
        identifiantProjet: lauréat.identifiantProjet,
      },
    });

    const expected = {
      ...lauréat.projet,
      statut: 'abandonné',
      recandidature: true,
      identifiantGestionnaire: {
        codeEIC: '',
      },
    };

    actual.should.be.deep.equal(expected);
  },
);

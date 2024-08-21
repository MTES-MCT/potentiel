import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../potentiel.world';

Alors(
  'le projet lauréat {string} devrait être consultable',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const lauréat = await mediator.send({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });
    expect(Option.isSome(lauréat)).to.be.true;
  },
);

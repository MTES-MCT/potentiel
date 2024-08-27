import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../potentiel.world';

Alors(
  'le projet lauréat {string} devrait être consultable',
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });
    assert(Option.isSome(lauréat), 'Le lauréat devrait être trouvé');
    expect(lauréat.dateDésignation).not.to.be.undefined;
  },
);

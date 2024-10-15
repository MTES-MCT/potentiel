import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../potentiel.world';

Alors('le projet lauréat devrait être consultable', async function (this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.notifierLauréatFixture.identifiantProjet;
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });
  assert(Option.isSome(lauréat), 'Le lauréat devrait être trouvé');
  expect(lauréat.notifiéLe).not.to.be.undefined;
});

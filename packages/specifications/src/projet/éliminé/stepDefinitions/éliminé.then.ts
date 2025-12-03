import { Then as Alors } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { Éliminé } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../potentiel.world';

Alors('le projet éliminé devrait être consultable', async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
      type: 'Éliminé.Query.ConsulterÉliminé',
      data: {
        identifiantProjet: this.éliminéWorld.identifiantProjet.formatter(),
      },
    });

    const actual = mapToPlainObject(éliminé);
    const expected = mapToPlainObject(this.éliminéWorld.mapToExpected());

    expect(actual).to.deep.eq(expected);
  });
});

Alors('le projet éliminé ne devrait plus être consultable', async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
      type: 'Éliminé.Query.ConsulterÉliminé',
      data: {
        identifiantProjet: this.éliminéWorld.identifiantProjet.formatter(),
      },
    });
    expect(Option.isNone(éliminé), 'Le projet éliminé ne devrait plus être consultable').to.be.true;
  });
});

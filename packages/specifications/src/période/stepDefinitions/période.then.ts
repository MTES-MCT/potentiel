import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';

import { PotentielWorld } from '../../potentiel.world';

Alors(
  `la période devrait être notifiée avec les lauréats et les éliminés`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierPériode.call(this, this.périodeWorld.identifiantPériode),
    );
  },
);

async function vérifierPériode(
  this: PotentielWorld,
  identifiantPériode: Période.IdentifiantPériode.ValueType,
) {
  const période = await mediator.send<Période.ConsulterPériodeQuery>({
    type: 'Période.Query.ConsulterPériode',
    data: {
      identifiantPériodeValue: identifiantPériode.formatter(),
    },
  });

  const actual = mapToPlainObject(période);
  const expected = mapToPlainObject(this.périodeWorld.mapToExpected(identifiantPériode));

  actual.should.be.deep.equal(expected);
}

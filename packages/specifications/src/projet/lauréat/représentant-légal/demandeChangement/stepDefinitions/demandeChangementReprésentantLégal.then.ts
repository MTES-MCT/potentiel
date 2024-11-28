import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PotentielWorld } from '../../../../../potentiel.world';

Alors(
  /une demande de changement de représentant légal du projet lauréat devrait être consultable/,
  async function (this: PotentielWorld) {
    console.log(
      'une demande de changement de représentant légal du projet lauréat devrait être consultable',
    );
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const représentantLégal = await mediator.send<ReprésentantLégal.ReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });
      const actual = mapToPlainObject(représentantLégal);
      const expected = mapToPlainObject(
        this.lauréatWorld.représentantLégalWorld.mapToExpected(identifiantProjet),
      );
      actual.should.be.deep.equal(expected);
    });
  },
);

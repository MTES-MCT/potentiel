import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { mapToPlainObject } from '@potentiel-domain/core';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  /le représentant légal du projet lauréat devrait être consultable/,
  async function (this: PotentielWorld) {
    return waitForExpect(async () =>
      vérifierReprésentantLégal.call(
        this,
        IdentifiantProjet.convertirEnValueType(
          this.candidatureWorld.importerCandidature.identifiantProjet,
        ),
      ),
    );
  },
);

async function vérifierReprésentantLégal(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
) {
  const représentantLégal = await mediator.send<ReprésentantLégal.ReprésentantLégalQuery>({
    type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });

  const actual = mapToPlainObject(représentantLégal);
  const expected = mapToPlainObject(
    this.lauréatWorld.représentantLégalWorld.mapToExpected(identifiantProjet),
  );

  actual.should.be.deep.equal(expected);
}

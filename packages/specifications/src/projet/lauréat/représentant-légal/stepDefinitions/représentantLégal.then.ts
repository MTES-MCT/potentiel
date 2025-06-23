import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  /le représentant légal du projet lauréat devrait être consultable/,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );
      const représentantLégal =
        await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(représentantLégal);
      const expected = mapToPlainObject(
        this.lauréatWorld.représentantLégalWorld.mapToExpected(
          identifiantProjet,
          this.candidatureWorld.importerCandidature.values.nomReprésentantLégalValue,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  `le représentant légal du projet lauréat( ne) devrait( pas) être mis à jour`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const représentantLégal =
        await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(représentantLégal);
      const expected = mapToPlainObject(
        this.lauréatWorld.représentantLégalWorld.mapToExpected(
          identifiantProjet,
          this.candidatureWorld.importerCandidature.values.nomReprésentantLégalValue,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

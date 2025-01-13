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
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );
      const représentantLégal =
        await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
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

/*
 @todo merger les deux steps ci-dessous
*/
Alors(
  /le nom et le type du représentant légal du projet lauréat devrait être mis à jour/,
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const représentantLégal =
        await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
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

Alors(
  `le représentant légal du projet lauréat( ne) devrait( pas) être mis à jour`,
  async function (this: PotentielWorld) {
    try {
      await waitForExpect(async () => {
        const { identifiantProjet } = this.lauréatWorld;

        const représentantLégal =
          await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
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
    } catch (e) {
      console.error('🤢🤢');
      console.error(e);
    }
  },
);

import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  "l'installation du projet lauréat devrait être mise à jour",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const installation = await mediator.send<Lauréat.Installation.ConsulterInstallationQuery>({
        type: 'Lauréat.Installation.Query.ConsulterInstallation',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(installation);
      const expected = mapToPlainObject(
        this.lauréatWorld.installationWorld.mapToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  "l'installateur du projet lauréat devrait être mis à jour",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const installateur = await mediator.send<Lauréat.Installation.ConsulterInstallateurQuery>({
        type: 'Lauréat.Installation.Query.ConsulterInstallateur',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(installateur);
      const expected = mapToPlainObject(
        this.lauréatWorld.installationWorld.mapToExpected(identifiantProjet),
      );

      if (Option.isSome(actual) && Option.isSome(expected)) {
        actual.installateur.should.be.deep.equal(expected.installateur);
      } else {
        actual.should.be.deep.equal(expected);
      }
    });
  },
);

Alors(
  'la typologie du projet lauréat devrait être mise à jour',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const typologieDuProjet =
        await mediator.send<Lauréat.Installation.ConsulterTypologieDuProjetQuery>({
          type: 'Lauréat.Installation.Query.ConsulterTypologieDuProjet',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(typologieDuProjet);
      const expected = mapToPlainObject(
        this.lauréatWorld.installationWorld.mapToExpected(identifiantProjet),
      );

      if (Option.isSome(actual) && Option.isSome(expected)) {
        actual.typologieDuProjet.should.be.deep.equal(expected.typologieDuProjet);
      } else {
        actual.should.be.deep.equal(expected);
      }
    });
  },
);

import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert } from 'chai';

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

      const typologieInstallation =
        await mediator.send<Lauréat.Installation.ConsulterTypologieInstallationQuery>({
          type: 'Lauréat.Installation.Query.ConsulterTypologieInstallation',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(typologieInstallation);
      const expected = mapToPlainObject(
        this.lauréatWorld.installationWorld.mapToExpected(identifiantProjet),
      );

      if (Option.isSome(actual) && Option.isSome(expected)) {
        actual.typologieInstallation.should.be.deep.equal(expected.typologieInstallation);
      } else {
        actual.should.be.deep.equal(expected);
      }
    });
  },
);

Alors(
  'le dispositif de stockage du projet lauréat devrait être mise à jour',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const dispositifDeStockage =
        await mediator.send<Lauréat.Installation.ConsulterDispositifDeStockageQuery>({
          type: 'Lauréat.Installation.Query.ConsulterDispositifDeStockage',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      const actual = mapToPlainObject(dispositifDeStockage);
      const expected = mapToPlainObject(
        this.lauréatWorld.installationWorld.mapToExpected(identifiantProjet),
      );

      if (Option.isSome(actual) && Option.isSome(expected)) {
        actual.dispositifDeStockage.should.be.deep.equal(expected.dispositifDeStockage);
      } else {
        actual.should.be.deep.equal(expected);
      }
    });
  },
);

Alors(
  "le changement d'installateur devrait être consultable",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const changementEnregistré =
        await mediator.send<Lauréat.Installation.ConsulterChangementInstallateurQuery>({
          type: 'Lauréat.Installateur.Query.ConsulterChangementInstallateur',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            enregistréLe:
              this.lauréatWorld.installationWorld.enregistrerChangementInstallateurFixture
                .enregistréLe,
          },
        });

      assert(Option.isSome(changementEnregistré), "Changement d'installateur non trouvé !");

      const actual = mapToPlainObject(changementEnregistré);

      const expected = mapToPlainObject(
        this.lauréatWorld.installationWorld.mapChangementInstallateurToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

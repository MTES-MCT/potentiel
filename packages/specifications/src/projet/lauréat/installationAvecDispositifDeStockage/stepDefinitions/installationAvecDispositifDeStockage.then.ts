import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  "l'information concernant le couplage de l'installation avec un dispositif de stockage pour le  projet lauréat devrait être mise à jour",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const installationAvecDispositifDeStockage =
        await mediator.send<Lauréat.InstallationAvecDispositifDeStockage.ConsulterInstallationAvecDispositifDeStockageQuery>(
          {
            type: 'Lauréat.InstallationAvecDispositifDeStockage.Query.Consulter',
            data: {
              identifiantProjet: identifiantProjet.formatter(),
            },
          },
        );

      const actual = mapToPlainObject(installationAvecDispositifDeStockage);
      const expected = mapToPlainObject(
        this.lauréatWorld.installationAvecDispositifDeStockageWorld.mapToExpected(
          identifiantProjet,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

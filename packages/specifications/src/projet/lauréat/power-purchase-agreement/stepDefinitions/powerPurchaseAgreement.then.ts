import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../../potentiel.world.js';

Alors(
  `l'état PPA devrait être consultable pour le projet lauréat`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const powerPurchaseAgreement =
        await mediator.send<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementQuery>({
          type: 'Lauréat.PowerPurchaseAgreement.Query.ConsulterPowerPurchaseAgreement',
          data: {
            identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          },
        });

      assert(Option.isSome(powerPurchaseAgreement), "Le PPA n'existe pas");
    });
  },
);

Alors(
  `l'état PPA ne devrait plus être consultable pour le projet lauréat`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const powerPurchaseAgreement =
        await mediator.send<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementQuery>({
          type: 'Lauréat.PowerPurchaseAgreement.Query.ConsulterPowerPurchaseAgreement',
          data: {
            identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          },
        });

      assert(Option.isNone(powerPurchaseAgreement), 'Le PPA existe');
    });
  },
);

import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../../potentiel.world.js';

Alors(
  `l'état PPA devrait être consultable pour le projet lauréat`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
        type: 'Lauréat.Query.ConsulterLauréat',
        data: {
          identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        },
      });

      assert(Option.isSome(lauréat), "Le projet lauréat n'existe pas");

      expect(lauréat.PPA).to.be.true;
    });
  },
);

import { Then as Alors } from '@cucumber/cucumber';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';

Alors(
  `une notification devrait être consultable pour la DREAL dans l'application`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {});
  },
);

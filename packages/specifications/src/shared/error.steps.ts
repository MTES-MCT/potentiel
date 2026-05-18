import { Then as Alors } from '@cucumber/cucumber';

import type { PotentielWorld } from '../potentiel.world.js';

Alors(
  /(.*) devrait être informé que "(.*)"/,
  function (this: PotentielWorld, _roleName: string, message: string) {
    this.error.message.should.be.equal(message);
  },
);

import { Then as Alors } from '@cucumber/cucumber';

import { PotentielWorld } from '../potentiel.world.js';

Alors(
  /(.*) devrait être informé que "(.*)"/,
  function (this: PotentielWorld, roleName: string, message: string) {
    this.error.message.should.be.equal(message);
  },
);

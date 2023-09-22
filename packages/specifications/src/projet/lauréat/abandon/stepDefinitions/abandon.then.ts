import { Then as Alors } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  `la recandidature du projet devrait être consultable dans la liste des projets lauréat abandonnés devant recandidater`,
  async function (this: PotentielWorld) {
    true.should.be.false;
  },
);

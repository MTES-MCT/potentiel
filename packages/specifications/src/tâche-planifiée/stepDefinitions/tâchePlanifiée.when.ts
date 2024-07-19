import { When as Quand } from '@cucumber/cucumber';

import { PotentielWorld } from '../../potentiel.world';

Quand(
  'on execute les tâches planifiées à la date du {string}',
  function (this: PotentielWorld, _date: string) {
    throw new Error('Not implemented');
  },
);

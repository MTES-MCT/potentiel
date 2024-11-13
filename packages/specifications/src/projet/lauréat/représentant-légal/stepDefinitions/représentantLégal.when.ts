import { When as Quand } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world';

import { importerReprésentantLégal } from './représentantLégal.given';

Quand(
  /le représentant légal est importé pour le projet lauréat/,
  async function (this: PotentielWorld) {
    try {
      await importerReprésentantLégal.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

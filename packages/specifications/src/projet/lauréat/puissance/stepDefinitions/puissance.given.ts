import { Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world';

import { demanderChangementPuissance } from './puissance.when';

EtantDonné(
  'une demande de changement de puissance à la baisse pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await demanderChangementPuissance.call(this, 'lauréat');
    } catch (error) {
      this.error = error as Error;
    }
  },
);

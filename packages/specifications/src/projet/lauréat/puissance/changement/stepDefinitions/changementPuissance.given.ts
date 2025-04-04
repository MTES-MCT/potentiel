import { Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../../potentiel.world';

import { demanderChangementPuissance } from './changementPuissance.when';

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

EtantDonné(
  'une demande de changement de puissance à la hausse pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await demanderChangementPuissance.call(this, 'lauréat', 1.2);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

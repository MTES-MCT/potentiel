import { Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world';

import { demanderDélai } from './délai.when';

EtantDonné(
  'une demande de délai en cours pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
  },
);

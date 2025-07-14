import { Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../../potentiel.world';

import {
  annulerDemandeDélai,
  demanderDélai,
  rejeterDemandeDélai,
  passerDemanderDélaiEnInstruction,
} from './délai.when';

EtantDonné(
  'une demande de délai en cours pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
  },
);

EtantDonné(
  'une demande de délai annulée pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
    await annulerDemandeDélai.call(this);
  },
);

EtantDonné(
  'une demande de délai rejetée pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
    await rejeterDemandeDélai.call(this);
  },
);

EtantDonné(
  'une demande de délai en instruction pour le projet lauréat',
  async function (this: PotentielWorld) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    });
    await passerDemanderDélaiEnInstruction.call(this);
  },
);

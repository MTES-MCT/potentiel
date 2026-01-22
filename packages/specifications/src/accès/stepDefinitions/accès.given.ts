import { Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../potentiel.world.js';

import { retirerAccèsProjet } from './accès.when.js';

EtantDonné(
  `l'accès retiré au projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'lauréat' ? this.lauréatWorld : this.éliminéWorld;

    await retirerAccèsProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
    });
  },
);

import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { PotentielWorld } from '../../../potentiel.world';

import { transmettreDemandeComplèteRaccordement } from './demandeComplèteRaccordement.when';

EtantDonné(
  'une demande complète de raccordement pour le projet lauréat',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordement.call(this, this.lauréatWorld.identifiantProjet);
  },
);

EtantDonné(
  'une demande complète de raccordement pour le projet lauréat avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    await transmettreDemandeComplèteRaccordement.call(
      this,
      this.lauréatWorld.identifiantProjet,
      datatable.rowsHash(),
    );
  },
);

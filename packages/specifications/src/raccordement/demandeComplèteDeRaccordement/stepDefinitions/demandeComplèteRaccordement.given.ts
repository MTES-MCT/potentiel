import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { Email } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../potentiel.world';

import { transmettreDemandeComplèteRaccordement } from './demandeComplèteRaccordement.when';

EtantDonné(
  'une demande complète de raccordement pour le projet lauréat',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordement.call(
      this,
      this.lauréatWorld.identifiantProjet,
      Email.convertirEnValueType(this.utilisateurWorld.porteurFixture.email),
    );
  },
);

EtantDonné(
  'une demande complète de raccordement pour le projet lauréat avec :',
  async function (this: PotentielWorld, datatable: DataTable) {
    await transmettreDemandeComplèteRaccordement.call(
      this,
      this.lauréatWorld.identifiantProjet,
      Email.convertirEnValueType(this.utilisateurWorld.porteurFixture.email),
      datatable.rowsHash(),
    );
  },
);

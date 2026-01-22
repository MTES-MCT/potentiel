import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';

import { Email } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../potentiel.world.js';

import {
  transmettreDemandeComplèteRaccordement,
  transmettreDemandeComplèteRaccordementSansAccuséRéception,
  transmettreDemandeComplèteRaccordementSansDateDeQualification,
} from './demandeComplèteRaccordement.when.js';

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

EtantDonné(
  'une demande complète de raccordement sans date de qualification pour le projet lauréat',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordementSansDateDeQualification.call(
      this,
      this.lauréatWorld.identifiantProjet,
    );
  },
);

EtantDonné(
  'une demande complète de raccordement sans accusé de réception pour le projet lauréat',
  async function (this: PotentielWorld) {
    await transmettreDemandeComplèteRaccordementSansAccuséRéception.call(
      this,
      this.lauréatWorld.identifiantProjet,
      Email.système,
    );
  },
);

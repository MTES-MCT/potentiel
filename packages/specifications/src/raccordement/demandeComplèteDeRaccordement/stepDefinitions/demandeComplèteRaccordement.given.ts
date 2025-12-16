import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { match } from 'ts-pattern';

import { Email } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../potentiel.world';

import {
  transmettreDemandeComplèteRaccordement,
  transmettreDemandeComplèteRaccordementSansAccuséRéception,
  transmettreDemandeComplèteRaccordementSansDateDeQualification,
} from './demandeComplèteRaccordement.when';

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
  'une demande complète de raccordement sans {string} pour le projet lauréat',
  async function (
    this: PotentielWorld,
    donnéeManquante: 'date de qualification' | 'accusé de réception',
  ) {
    return match(donnéeManquante)
      .with('accusé de réception', async () =>
        transmettreDemandeComplèteRaccordementSansAccuséRéception.call(
          this,
          this.lauréatWorld.identifiantProjet,
          Email.système,
        ),
      )
      .with('date de qualification', async () =>
        transmettreDemandeComplèteRaccordementSansDateDeQualification.call(
          this,
          this.lauréatWorld.identifiantProjet,
        ),
      )
      .exhaustive();
  },
);

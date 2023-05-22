import { Given as EtantDonné, When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';



EtantDonné(`plusieurs dossiers de raccordement`, async function (this: PotentielWorld) {});

Quand(
  `un administrateur importe des dates de mise en service pour chacun de ces dossiers`,
  async function (this: PotentielWorld) {},
);

Alors(
  `les dossiers devrait avoir la date de mise en service`,
  async function (this: PotentielWorld) {},
);

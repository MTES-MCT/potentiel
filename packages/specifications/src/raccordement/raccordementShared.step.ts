import { Given as EtantDonné } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';

EtantDonné(`un dossier de raccordement`, async function (this: PotentielWorld) {
  await this.raccordementWorld.createDemandeComplèteRaccordement(
    this.gestionnaireRéseauWorld.enedis.codeEIC,
  );
});

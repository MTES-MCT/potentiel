import { Given as EtantDonné, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import { buildListerDossiersRaccordementUseCase } from '@potentiel/domain';

EtantDonné(`un dossier de raccordement`, async function (this: PotentielWorld) {
  await this.raccordementWorld.createDemandeComplèteRaccordement(
    this.gestionnaireRéseauWorld.enedis.codeEIC,
  );
});

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet`,
  async function (this: PotentielWorld) {
    const actual = await mediator.send(
      buildListerDossiersRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    actual.références.should.contain(this.raccordementWorld.référenceDossierRaccordement);
  },
);

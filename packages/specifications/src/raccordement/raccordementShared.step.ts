import { Given as EtantDonné, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import {
  buildListerDossiersRaccordementUseCase,
  buildTransmettreDemandeComplèteRaccordementUseCase,
} from '@potentiel/domain';
import { Readable } from 'stream';

EtantDonné(`un dossier de raccordement`, async function (this: PotentielWorld) {
  await this.raccordementWorld.createDemandeComplèteRaccordement(
    this.gestionnaireRéseauWorld.enedis.codeEIC,
    'UNE-REFERENCE-DCR',
  );
});

EtantDonné(
  `plusieurs dossiers de raccordement avec la même référence`,
  async function (this: PotentielWorld) {
    await this.raccordementWorld.createDemandeComplèteRaccordement(
      this.gestionnaireRéseauWorld.enedis.codeEIC,
      'UNE-REFERENCE-DCR',
    );

    await mediator.send(
      buildTransmettreDemandeComplèteRaccordementUseCase({
        référenceDossierRaccordement: 'UNE-REFERENCE-DCR',
        accuséRéception: {
          format: 'application/pdf',
          content: Readable.from("Un autre contenu d'un fichier DCR", {
            encoding: 'utf8',
          }),
        },
        identifiantGestionnaireRéseau: { codeEIC: this.gestionnaireRéseauWorld.codeEIC },
        identifiantProjet: {
          appelOffre: 'PPE2 - Eolien',
          période: '1',
          numéroCRE: '9',
        },
        dateQualification: new Date(),
      }),
    );
  },
);

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

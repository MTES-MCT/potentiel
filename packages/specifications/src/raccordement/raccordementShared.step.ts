import { Given as EtantDonné, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import {
  buildConsulterDemandeComplèteRaccordementUseCase,
  buildConsulterDossierRaccordementUseCase,
  buildConsulterPropositionTechniqueEtFinancièreUseCase,
  buildListerDossiersRaccordementUseCase,
} from '@potentiel/domain';
import { expect } from 'chai';
import { Readable } from 'stream';

EtantDonné(`un dossier de raccordement`, async function (this: PotentielWorld) {
  await this.raccordementWorld.createDemandeComplèteRaccordement(
    this.gestionnaireRéseauWorld.enedis.codeEIC,
    'XXX-RP-2021-999999',
  );
});

EtantDonné(
  `un dossier de raccordement avec une proposition technique et financière`,
  async function (this: PotentielWorld) {
    await this.raccordementWorld.createDemandeComplèteRaccordement(
      this.gestionnaireRéseauWorld.enedis.codeEIC,
      'XXX-RP-2021-999999',
    );

    await this.raccordementWorld.createPropositionTechniqueEtFinancière();
  },
);

Alors(
  `l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld) {
    const demandeComplèteRaccordement = await mediator.send(
      buildConsulterDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      }),
    );
    expect(demandeComplèteRaccordement.format).to.be.equal(
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
    );
    expect(demandeComplèteRaccordement.content).to.be.instanceof(Readable);
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

Alors(
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld) {
    const { propositionTechniqueEtFinancière } = await mediator.send(
      buildConsulterDossierRaccordementUseCase({
        référence: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    expect(propositionTechniqueEtFinancière?.dateSignature).to.be.equal(
      this.raccordementWorld.propositionTechniqueEtFinancièreSignée.dateSignature.toISOString(),
    );
    expect(propositionTechniqueEtFinancière?.format).to.be.equal(
      this.raccordementWorld.propositionTechniqueEtFinancièreSignée.format,
    );

    const propositionTechniqueEtFinancièreSignée = await mediator.send(
      buildConsulterPropositionTechniqueEtFinancièreUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      }),
    );

    expect(propositionTechniqueEtFinancièreSignée.format).to.be.equal(
      this.raccordementWorld.propositionTechniqueEtFinancièreSignée.format,
    );
    expect(propositionTechniqueEtFinancièreSignée.content).to.be.instanceof(Readable);
  },
);

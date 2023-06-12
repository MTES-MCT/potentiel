import { Given as EtantDonné, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { mediator } from 'mediateur';
import { expect } from 'chai';
import { Readable } from 'stream';
import { ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery } from '@potentiel/domain-views/src/raccordement/consulter/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import { isNone } from '@potentiel/monads';
import {
  ConsulterDossierRaccordementQuery,
  DossierRaccordementReadModel,
  ListerDossiersRaccordementQuery,
  PropositionTechniqueEtFinancièreSignéeReadModel,
} from '@potentiel/domain-views';
import { ConsulterPropositionTechniqueEtFinancièreSignéeQuery } from '@potentiel/domain-views/src/raccordement/consulter/consulterPropositionTechniqueEtFinancièreSignée.query';
import { convertReadableToString } from '../helpers/convertReadableToString';

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
  `la demande complète de raccordement devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld) {
    const actualDossierRaccordement = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      },
    });

    const expectedDossierRaccordement: DossierRaccordementReadModel = {
      dateQualification: this.raccordementWorld.dateQualification.toISOString(),
      accuséRéception: {
        format: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
      },
      référence: this.raccordementWorld.référenceDossierRaccordement,
      type: 'dossier-raccordement',
    };

    actualDossierRaccordement.should.be.deep.equal(expectedDossierRaccordement);

    const accuséRéception =
      await mediator.send<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery>({
        type: 'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
        data: {
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        },
      });

    if (isNone(accuséRéception)) {
      throw new Error('Demande de raccordement non trouvée');
    }

    const actualFormat = accuséRéception.format;
    const expectedFormat = this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format;

    actualFormat.should.be.equal(expectedFormat);

    const actualContent = await convertReadableToString(accuséRéception.content);
    const expectedContent =
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.content;

    console.log(`Actual: `, actualContent);
    console.log(`Expected: `, expectedContent);

    actualContent.should.be.equal(expectedContent);
  },
);

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet`,
  async function (this: PotentielWorld) {
    const actual = await mediator.send<ListerDossiersRaccordementQuery>({
      type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      },
    });

    actual.références.should.contain(this.raccordementWorld.référenceDossierRaccordement);
  },
);

Alors(
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld) {
    const propositionTechniqueEtFinancièreSignée =
      await mediator.send<ConsulterPropositionTechniqueEtFinancièreSignéeQuery>({
        type: 'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
        data: {
          référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
          identifiantProjet: this.raccordementWorld.identifiantProjet,
        },
      });

    isNone(propositionTechniqueEtFinancièreSignée).should.equal(false);

    (
      propositionTechniqueEtFinancièreSignée as PropositionTechniqueEtFinancièreSignéeReadModel
    ).format.should.to.be.equal(
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
    );
    (
      propositionTechniqueEtFinancièreSignée as PropositionTechniqueEtFinancièreSignéeReadModel
    ).content.should.be.instanceof(Readable);

    const dossierRaccordement = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      },
    });

    expect(dossierRaccordement.propositionTechniqueEtFinancière?.dateSignature).to.be.equal(
      this.raccordementWorld.dateSignature.toISOString(),
    );

    expect(dossierRaccordement.propositionTechniqueEtFinancière?.format).to.be.equal(
      this.raccordementWorld.propositionTechniqueEtFinancièreSignée.format,
    );
  },
);

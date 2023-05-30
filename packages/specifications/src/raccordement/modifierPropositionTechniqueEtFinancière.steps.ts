import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  buildConsulterDossierRaccordementUseCase,
  buildModifierPropositiontechniqueEtFinancièreUseCase,
  buildConsulterPropositionTechniqueEtFinancièreUseCase,
} from '@potentiel/domain';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import { Readable } from 'stream';

Quand(
  `le porteur modifie la proposition technique et financière`,
  async function (this: PotentielWorld) {
    const dateSignature = new Date('2023-04-26');
    const propositionTechniqueEtFinancièreSignée = {
      format: 'application/pdf',
      content: Readable.from("Contenu d'un autre fichier PTF", {
        encoding: 'utf8',
      }),
    };
    await mediator.send(
      buildModifierPropositiontechniqueEtFinancièreUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        dateSignature: new Date(dateSignature),
        nouvellePropositionTechniqueEtFinancière: propositionTechniqueEtFinancièreSignée,
      }),
    );

    this.raccordementWorld.propositionTechniqueEtFinancièreSignée = {
      dateSignature,
      ...propositionTechniqueEtFinancièreSignée,
    };
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

    // TODO improve assert
    propositionTechniqueEtFinancièreSignée.should.be.ok;
  },
);

Quand(
  `un administrateur modifie la date de signature pour un dossier de raccordement non connu`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildModifierPropositiontechniqueEtFinancièreUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          dateSignature: new Date('2023-04-26'),
          référenceDossierRaccordement: 'dossier-inconnu',
          nouvellePropositionTechniqueEtFinancière:
            this.raccordementWorld.propositionTechniqueEtFinancièreSignée,
        }),
      );
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

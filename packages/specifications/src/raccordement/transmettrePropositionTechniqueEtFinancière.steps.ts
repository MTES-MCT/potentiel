import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  buildConsulterPropositionTechniqueEtFinancièreUseCase,
  buildTransmettrePropositionTechniqueEtFinancièreUseCase,
} from '@potentiel/domain';
import { expect } from 'chai';
import { mediator } from 'mediateur';

Quand(
  `le porteur de projet transmet une proposition technique et financière pour ce dossier de raccordement avec la date de signature au {string}`,
  async function (this: PotentielWorld) {
    const dateSignature = new Date('2021-04-28');
    await mediator.send(
      buildTransmettrePropositionTechniqueEtFinancièreUseCase({
        dateSignature,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        nouvellePropositionTechniqueEtFinancière:
          this.raccordementWorld.propositionTechniqueEtFinancièreSignée,
      }),
    );

    this.raccordementWorld.propositionTechniqueEtFinancièreSignée.dateSignature = dateSignature;
  },
);

Alors(
  `la proposition technique et financière signée devrait être consultable dans le raccordement`,
  async function (this: PotentielWorld) {
    const ptf = await mediator.send(
      buildConsulterPropositionTechniqueEtFinancièreUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      }),
    );

    expect(ptf).to.be.deep.equal(this.raccordementWorld.propositionTechniqueEtFinancièreSignée);
  },
);

Quand(
  `un administrateur transmet une proposition technique et financière pour un projet n'ayant aucun dossier de raccordement`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildTransmettrePropositionTechniqueEtFinancièreUseCase({
          dateSignature: new Date(),
          référenceDossierRaccordement: 'dossier-inconnu',
          identifiantProjet: this.raccordementWorld.identifiantProjet,
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

Quand(
  `un administrateur transmet une proposition technique et financière pour un dossier de raccordement non référencé`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildTransmettrePropositionTechniqueEtFinancièreUseCase({
          dateSignature: new Date(),
          référenceDossierRaccordement: 'dossier-inconnu',
          identifiantProjet: this.raccordementWorld.identifiantProjet,
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

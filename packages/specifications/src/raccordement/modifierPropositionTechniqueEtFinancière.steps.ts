import { When as Quand } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  buildModifierPropositiontechniqueEtFinancièreUseCase,
} from '@potentiel/domain';
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

Quand(
  `le porteur modifie la date de signature de la proposition technique et financière`,
  async function (this: PotentielWorld) {
    const nouvelledateSignature = new Date('2023-04-01');

    await mediator.send(
      buildModifierPropositiontechniqueEtFinancièreUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        dateSignature: new Date(nouvelledateSignature),
        nouvellePropositionTechniqueEtFinancière: {
          format: 'application/pdf',
          content: Readable.from("Contenu d'un fichier PTF", {
            encoding: 'utf8',
          }),
        },
      }),
    );

    this.raccordementWorld.propositionTechniqueEtFinancièreSignée = {
      ...this.raccordementWorld.propositionTechniqueEtFinancièreSignée,
      dateSignature: nouvelledateSignature,
      format: 'application/pdf',
      content: Readable.from("Contenu d'un fichier PTF", {
        encoding: 'utf8',
      }),
    };
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

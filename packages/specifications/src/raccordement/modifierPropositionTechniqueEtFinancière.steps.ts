import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  consulterDossierRaccordementQueryHandlerFactory,
  modifierPropositionTechniqueEtFinancièreCommandHandlerFactory,
} from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { findProjection } from '@potentiel/pg-projections';
import { expect } from 'chai';

Quand(
  `le porteur modifie la date de signature de la proposition technique et financière au {string}`,
  async function (this: PotentielWorld, dateSignature: string) {
    const modifierPropositionTechniqueEtFinancière =
      modifierPropositionTechniqueEtFinancièreCommandHandlerFactory({
        loadAggregate,
        publish,
      });

    await modifierPropositionTechniqueEtFinancière({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      dateSignature: new Date(dateSignature),
    });
  },
);

Alors(
  `la date de signature {string} devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld, dateSignature: string) {
    const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    const actual = await consulterDossierRaccordement({
      référence: this.raccordementWorld.référenceDossierRaccordement,
      identifiantProjet: this.raccordementWorld.identifiantProjet,
    });

    expect(actual.propositionTechniqueEtFinancière).to.deep.equal({
      dateSignature: new Date(dateSignature).toISOString(),
    });
  },
);

Quand(
  `un administrateur modifie la date de signature pour un dossier de raccordement non connu`,
  async function (this: PotentielWorld) {
    try {
      const modifierPropositionTechniqueEtFinancière =
        modifierPropositionTechniqueEtFinancièreCommandHandlerFactory({
          loadAggregate,
          publish,
        });

      await modifierPropositionTechniqueEtFinancière({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        dateSignature: new Date('2023-04-26'),
        référenceDossierRaccordement: 'dossier-inconnu',
      });
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

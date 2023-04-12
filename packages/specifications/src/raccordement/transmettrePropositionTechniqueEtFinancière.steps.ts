import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import {
  consulterDossierRaccordementQueryHandlerFactory,
  transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import { expect } from 'chai';

Quand(
  `le porteur de projet transmet une proposition technique et financière pour ce dossier de raccordement avec la date de signature au {string}`,
  async function (this: PotentielWorld, dateSignature: string) {
    const transmettrePropositionTechniqueEtFinancière =
      transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory({
        loadAggregate,
        publish,
      });

    await transmettrePropositionTechniqueEtFinancière({
      dateSignature: new Date(dateSignature),
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      identifiantProjet: this.raccordementWorld.identifiantProjet,
    });
  },
);

Alors(
  `une proposition technique et financière devrait être consultable dans le dossier de raccordement avec une date de signature au {string}`,
  async function (this: PotentielWorld, dateSignature: string) {
    const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    const actual = await consulterDossierRaccordement({
      référence: this.raccordementWorld.référenceDossierRaccordement,
    });

    expect(actual.propositionTechniqueEtFinancière).to.deep.equal({
      dateSignature: new Date(dateSignature).toISOString(),
    });
  },
);

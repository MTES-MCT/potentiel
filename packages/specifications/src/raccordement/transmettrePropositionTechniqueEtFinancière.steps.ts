import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import {
  consulterDossierRaccordementQueryHandlerFactory,
  transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';

Quand(
  `le porteur de projet transmet une proposition technique et financière pour un dossier de raccordement avec la date de signature au {string}`,
  async function (this: PotentielWorld, dateSignature: string) {
    await this.raccordementWorld.createDemandeComplèteRaccordement(
      this.gestionnaireRéseauWorld.enedis.codeEIC,
    );

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

    await waitForExpect(async () => {
      const actual = await consulterDossierRaccordement({
        référence: this.raccordementWorld.référenceDossierRaccordement,
      });

      expect(actual.propositionTechniqueEtFinancière).toEqual({
        dateSignature: new Date(dateSignature).toISOString(),
      });
    });
  },
);

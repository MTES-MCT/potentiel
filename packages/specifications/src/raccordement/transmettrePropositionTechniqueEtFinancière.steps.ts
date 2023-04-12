import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import {
  consulterDemandeComplèteRaccordementQueryHandlerFactory,
  transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';

Quand(
  `le porteur de projet transmet une proposition technique et financière pour une demande complète de raccordement avec la date de signature au {string}`,
  async function (this: PotentielWorld, dateSignature: string) {
    await this.gestionnaireRéseauWorld.createGestionnaireRéseau(
      this.raccordementWorld.enedis.codeEIC,
      this.raccordementWorld.enedis.raisonSociale,
    );
    await this.raccordementWorld.createDemandeComplèteRaccordement();

    const transmettrePropositionTechniqueEtFinancière =
      transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory({
        loadAggregate,
        publish,
      });

    await transmettrePropositionTechniqueEtFinancière({
      dateSignature: new Date(dateSignature),
      référenceDemandeComplèteRaccordement: this.raccordementWorld.référenceDemandeRaccordement,
      identifiantProjet: this.raccordementWorld.identifiantProjet,
    });
  },
);

Alors(
  `une proposition technique et financière devrait être consultable dans la demande complète de raccordement avec une date de signature au {string}`,
  async function (this: PotentielWorld, dateSignature: string) {
    const consulterDemandeComplèteRaccordement =
      consulterDemandeComplèteRaccordementQueryHandlerFactory({
        find: findProjection,
      });

    await waitForExpect(async () => {
      const actual = await consulterDemandeComplèteRaccordement({
        référenceDemandeRaccordement: this.raccordementWorld.référenceDemandeRaccordement,
      });

      actual.propositionTechniqueEtFinancière?.should.be.deep.equal({
        dateSignature: new Date(dateSignature).toISOString(),
      });
    });
  },
);

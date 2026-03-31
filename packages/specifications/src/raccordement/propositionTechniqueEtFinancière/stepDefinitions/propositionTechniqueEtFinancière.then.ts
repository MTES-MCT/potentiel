import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

import { waitForExpect, expectFileContent } from '#helpers';

import { PotentielWorld } from '../../../potentiel.world.js';
import { vérifierDossierRaccordement } from '../../dossierRaccordement/stepDefinitions/dossierRaccordement.then.js';

Alors(
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await waitForExpect(async () => {
      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      vérifierDossierRaccordement.call(this, dossierRaccordement);
      assert(Option.isSome(dossierRaccordement));

      const { propositionTechniqueEtFinancière } = dossierRaccordement;

      assert(propositionTechniqueEtFinancière, 'propositionTechniqueEtFinancière is undefined');

      const { propositionTechniqueEtFinancièreSignée } = this.raccordementWorld
        .propositionTechniqueEtFinancière.modifierFixture.aÉtéCréé
        ? this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture
        : this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture;

      await expectFileContent(
        propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée,
        propositionTechniqueEtFinancièreSignée,
      );
    });
  },
);

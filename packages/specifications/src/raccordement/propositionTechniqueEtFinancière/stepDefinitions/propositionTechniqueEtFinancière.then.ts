import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Document } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../potentiel.world.js';
import { convertReadableStreamToString } from '../../../helpers/convertReadableToString.js';
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

      vérifierDossierRaccordement.call(this, identifiantProjet, dossierRaccordement);
      assert(Option.isSome(dossierRaccordement));

      const { propositionTechniqueEtFinancière } = dossierRaccordement;

      assert(propositionTechniqueEtFinancière, 'propositionTechniqueEtFinancière is undefined');

      const { propositionTechniqueEtFinancièreSignée } = this.raccordementWorld
        .propositionTechniqueEtFinancière.modifierFixture.aÉtéCréé
        ? this.raccordementWorld.propositionTechniqueEtFinancière.modifierFixture
        : this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture;

      const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey:
            propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.formatter(),
        },
      });

      assert(Option.isSome(result), `Proposition technique et financière signée non trouvée !`);

      const actualContent = await convertReadableStreamToString(result.content);

      actualContent.should.be.equal(propositionTechniqueEtFinancièreSignée.content);
    });
  },
);

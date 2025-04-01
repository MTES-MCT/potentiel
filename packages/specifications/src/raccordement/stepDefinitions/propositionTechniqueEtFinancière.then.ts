import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert } from 'chai';

import { Raccordement } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../potentiel.world';
import { convertReadableStreamToString } from '../../helpers/convertReadableToString';

import { vérifierDossierRaccordement } from './raccordement.then';

Alors(
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await waitForExpect(async () => {
      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
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

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey:
            propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.formatter(),
        },
      });

      assert(Option.isSome(result), `Proposition technique et financière signée non trouvée !`);

      const actualContent = await convertReadableStreamToString(result.content);
      const expectedContent = await convertReadableStreamToString(
        propositionTechniqueEtFinancièreSignée.content,
      );

      actualContent.should.be.equal(expectedContent);
    });
  },
);

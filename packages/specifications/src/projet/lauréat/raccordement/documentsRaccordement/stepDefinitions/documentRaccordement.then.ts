import { Then as Alors } from '@cucumber/cucumber';
import { assert } from 'chai';
import { mediator } from 'mediateur';

import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { expectFileContent, waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../../../../potentiel.world.js';
import { vérifierDossierRaccordement } from '../../dossierRaccordement/stepDefinitions/dossierRaccordement.then.js';

Alors(
  'le document devrait être consultable dans le dossier de raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.lauréatWorld.raccordementWorld;
    await waitForExpect(async () => {
      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      assert(Option.isSome(dossierRaccordement));
      vérifierDossierRaccordement.call(this, dossierRaccordement);

      const {
        propositionTechniqueEtFinancière,
        conventionDeRaccordement,
        conventionDirecteDeRaccordement,
      } = dossierRaccordement;

      if (propositionTechniqueEtFinancière) {
        const document =
          this.lauréatWorld.raccordementWorld.documentRaccordement.getDocumentRaccordement(
            'proposition-technique-et-financière',
          );

        assert(document, 'La proposition technique et financière devrait exister');

        await expectFileContent(propositionTechniqueEtFinancière.document, document.document);
      }

      if (conventionDeRaccordement) {
        const document =
          this.lauréatWorld.raccordementWorld.documentRaccordement.getDocumentRaccordement(
            'convention-de-raccordement',
          );

        assert(document, 'La convention de raccordement devrait exister');

        await expectFileContent(conventionDeRaccordement.document, document.document);
      }

      if (conventionDirecteDeRaccordement) {
        const document =
          this.lauréatWorld.raccordementWorld.documentRaccordement.getDocumentRaccordement(
            'convention-directe-de-raccordement',
          );

        assert(document, 'La convention directe de raccordement devrait exister');

        await expectFileContent(conventionDirecteDeRaccordement.document, document.document);
      }
    });
  },
);
Alors(
  'le document ne devrait plus être consultable dans le dossier de raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.lauréatWorld.raccordementWorld;
    const { type } = this.lauréatWorld.raccordementWorld.documentRaccordement.supprimerFixture;

    await waitForExpect(async () => {
      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      assert(Option.isSome(dossierRaccordement));
      vérifierDossierRaccordement.call(this, dossierRaccordement);
    });
  },
);

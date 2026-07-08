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
    const { type } = this.lauréatWorld.raccordementWorld.documentRaccordement.transmettreFixture;

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

      const documentFromDossier = await mediator.send<Lauréat.Raccordement.ConsulterDocumentQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterDocument',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierRaccordementValue: référenceDossier,
          typeDocumentValue: type,
        },
      });
      const document =
        this.lauréatWorld.raccordementWorld.documentRaccordement.getDocumentRaccordement(type);

      assert(Option.isSome(documentFromDossier), 'Le document issu de la query devrait exister');
      assert(document, 'Le document devrait exister');

      await expectFileContent(documentFromDossier.document, document.document);
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
      const document = await mediator.send<Lauréat.Raccordement.ConsulterDocumentQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterDocument',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierRaccordementValue: référenceDossier,
          typeDocumentValue: type,
        },
      });
      assert(Option.isNone(document));

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

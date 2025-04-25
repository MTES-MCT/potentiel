import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Raccordement } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../potentiel.world';

import { vérifierDossierRaccordement } from './raccordement.then';

Alors(
  `la date de mise en service devrait être consultable dans le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await waitForExpect(async () => {
      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            référenceDossierRaccordementValue: référenceDossier,
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      vérifierDossierRaccordement.call(this, identifiantProjet, dossierRaccordement);
    });
  },
);

Alors(
  `la mise en service du dossier de raccordement devrait être supprimée`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await waitForExpect(async () => {
      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            référenceDossierRaccordementValue: référenceDossier,
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      assert(Option.isSome(dossierRaccordement));

      expect(dossierRaccordement.miseEnService).to.be.undefined;
    });
  },
);

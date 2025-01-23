import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

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
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            référenceDossierRaccordementValue: référenceDossier,
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      vérifierDossierRaccordement.call(this, identifiantProjet, dossierRaccordement);
    });
  },
);

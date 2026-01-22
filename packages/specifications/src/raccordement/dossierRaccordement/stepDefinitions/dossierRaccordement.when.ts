import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world.js';

Quand(
  `le porteur supprime le dossier de raccordement pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    try {
      await mediator.send<Lauréat.Raccordement.SupprimerDossierDuRaccordementUseCase>({
        type: 'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossier,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur supprime le dossier de raccordement pour le projet lauréat avec pour référence {string}`,
  async function (this: PotentielWorld, référenceDossier) {
    const { identifiantProjet } = this.lauréatWorld;

    try {
      await mediator.send<Lauréat.Raccordement.SupprimerDossierDuRaccordementUseCase>({
        type: 'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossier,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../potentiel.world';

Quand(
  `le porteur supprime le dossier de raccordement pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    try {
      await mediator.send<Raccordement.SupprimerDossierDuRaccordementUseCase>({
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
      await mediator.send<Raccordement.SupprimerDossierDuRaccordementUseCase>({
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

import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world.js';

Quand(
  /(le porteur|l'administrateur) supprime le dossier de raccordement pour le projet lauréat$/,
  async function (this: PotentielWorld, rôle: 'le porteur' | "l'administrateur") {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;

    const { suppriméParValue, rôleValue } = match(rôle)
      .with("l'administrateur", () => ({
        suppriméParValue: this.utilisateurWorld.adminFixture.email,
        rôleValue: this.utilisateurWorld.adminFixture.role,
      }))
      .with('le porteur', () => ({
        suppriméParValue: this.utilisateurWorld.porteurFixture.email,
        rôleValue: this.utilisateurWorld.porteurFixture.role,
      }))
      .exhaustive();

    try {
      await mediator.send<Lauréat.Raccordement.SupprimerDossierDuRaccordementUseCase>({
        type: 'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossier,
          suppriméLeValue: new Date().toISOString(),
          suppriméParValue,
          rôleValue,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  /(le porteur|l'administrateur) supprime le dossier de raccordement pour le projet lauréat avec :$/,
  async function (
    this: PotentielWorld,
    rôle: 'le porteur' | "l'administrateur",
    datatable: DataTable,
  ) {
    const { identifiantProjet } = this.lauréatWorld;

    const { suppriméParValue, rôleValue } = match(rôle)
      .with("l'administrateur", () => ({
        suppriméParValue: this.utilisateurWorld.adminFixture.email,
        rôleValue: this.utilisateurWorld.adminFixture.role,
      }))
      .with('le porteur', () => ({
        suppriméParValue: this.utilisateurWorld.porteurFixture.email,
        rôleValue: this.utilisateurWorld.porteurFixture.role,
      }))
      .exhaustive();

    const { référenceDossier } =
      this.raccordementWorld.dateMiseEnService.transmettreFixture.mapExempleToFixtureValues(
        datatable.rowsHash(),
      );

    if (!référenceDossier) {
      throw new Error(
        `La table d'exemple doit contenir le champ "La référence du dossier de raccordement"`,
      );
    }

    try {
      await mediator.send<Lauréat.Raccordement.SupprimerDossierDuRaccordementUseCase>({
        type: 'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossier,
          suppriméLeValue: new Date().toISOString(),
          suppriméParValue,
          rôleValue,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur supprime un dossier de raccordement non référencé pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    try {
      await mediator.send<Lauréat.Raccordement.SupprimerDossierDuRaccordementUseCase>({
        type: 'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: 'référence-non-connue',
          suppriméLeValue: new Date().toISOString(),
          suppriméParValue: this.utilisateurWorld.porteurFixture.email,
          rôleValue: this.utilisateurWorld.porteurFixture.role,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

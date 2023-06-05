import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  buildConsulterDossierRaccordementUseCase,
  buildTransmettreDateMiseEnServiceUseCase,
} from '@potentiel/domain';
import { expect } from 'chai';
import { mediator } from 'mediateur';

Quand(
  `un administrateur transmet la date de mise en service {string} pour ce dossier de raccordement`,
  async function (this: PotentielWorld, dateMiseEnService: string) {
    await mediator.send(
      buildTransmettreDateMiseEnServiceUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        dateMiseEnService: new Date(dateMiseEnService),
      }),
    );
  },
);

Quand(
  `un administrateur transmet la date de mise en service {string} avec seulement la référence du dossier de raccordement {string}`,
  async function (
    this: PotentielWorld,
    dateMiseEnService: string,
    référenceDossierRaccordement: string,
  ) {
    await mediator.send(
      buildTransmettreDateMiseEnServiceUseCase({
        référenceDossierRaccordement,
        dateMiseEnService: new Date(dateMiseEnService),
      }),
    );
  },
);

Alors(
  `la date de mise en service {string} devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld, dateMiseEnService: string) {
    const actual = await mediator.send(
      buildConsulterDossierRaccordementUseCase({
        référence: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    expect(actual.dateMiseEnService).to.equal(new Date(dateMiseEnService).toISOString());
  },
);

Quand(
  `un administrateur transmet une date de mise en service pour un projet n'ayant aucun dossier de raccordement`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildTransmettreDateMiseEnServiceUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          référenceDossierRaccordement: 'dossier-inconnu',
          dateMiseEnService: new Date('2023-03-15'),
        }),
      );
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

Quand(
  `un administrateur transmet une date de mise en service avec seulement une référence ne correspondant à aucun dossier`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildTransmettreDateMiseEnServiceUseCase({
          référenceDossierRaccordement: 'dossier-inconnu',
          dateMiseEnService: new Date('2023-03-15'),
        }),
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un administrateur transmet une date de mise en service avec seulement cette référence`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildTransmettreDateMiseEnServiceUseCase({
          référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
          dateMiseEnService: new Date('2023-03-15'),
        }),
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un administrateur transmet une date de mise en service pour un dossier de raccordement non référencé`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildTransmettreDateMiseEnServiceUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          référenceDossierRaccordement: 'dossier-inconnu',
          dateMiseEnService: new Date('2023-03-15'),
        }),
      );
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

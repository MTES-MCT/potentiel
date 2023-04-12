import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  consulterDossierRaccordementQueryHandlerFactory,
  transmettreDateMiseEnServiceCommandHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { expect } from 'chai';

Quand(
  `un administrateur transmet la date de mise en service {string} pour ce dossier de raccordement`,
  async function (this: PotentielWorld, dateMiseEnService: string) {
    const transmettreDateMiseEnService = transmettreDateMiseEnServiceCommandHandlerFactory({
      loadAggregate,
      publish,
    });

    await transmettreDateMiseEnService({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      dateMiseEnService: new Date(dateMiseEnService),
    });
  },
);

Alors(
  `la date de mise en service {string} devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld, dateMiseEnService: string) {
    const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    const actual = await consulterDossierRaccordement({
      référence: this.raccordementWorld.référenceDossierRaccordement,
    });

    expect(actual.dateMiseEnService).to.equal(new Date(dateMiseEnService).toISOString());
  },
);

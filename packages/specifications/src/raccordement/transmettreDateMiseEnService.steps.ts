import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  consulterDossierRaccordementQueryHandlerFactory,
  transmettreDateMiseEnServiceCommandHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';

Quand(
  `un administrateur transmet la date de mise en service {string} pour un dossier de raccordement`,
  async function (this: PotentielWorld, dateMiseEnService: string) {
    await this.raccordementWorld.createDemandeComplèteRaccordement(
      this.gestionnaireRéseauWorld.enedis.codeEIC,
    );

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

    await waitForExpect(async () => {
      const actual = await consulterDossierRaccordement({
        référence: this.raccordementWorld.référenceDossierRaccordement,
      });

      expect(actual.dateMiseEnService).toEqual(new Date(dateMiseEnService).toISOString());
    });
  },
);

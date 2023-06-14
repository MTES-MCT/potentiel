import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DomainUseCase,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import { ConsulterDossierRaccordementQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';

Quand(
  `un administrateur transmet la date de mise en service {string} pour le dossier de raccordement ayant pour référence {string}`,
  async function (
    this: PotentielWorld,
    dateMiseEnService: string,
    référenceDossierRaccordement: string,
  ) {
    const dateMiseEnServiceDate = new Date(dateMiseEnService);

    this.raccordementWorld.dateMiseEnService = dateMiseEnServiceDate;
    this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;

    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.projetWorld.identifiantProjet),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          dateMiseEnService: dateMiseEnServiceDate,
        },
      });
    } catch (e) {
      console.log(e);
      this.error = e as Error;
    }
  },
);

Alors(
  `la date de mise en service {string} devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld, dateMiseEnService: string) {
    const actual = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.projetWorld.identifiantProjet,
      },
    });

    if (isNone(actual)) {
      throw new Error('Dossier de raccordement non trouvé');
    }

    expect(actual.dateMiseEnService).to.equal(new Date(dateMiseEnService).toISOString());
  },
);

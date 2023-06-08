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

Quand(
  `un administrateur transmet la date de mise en service {string} pour ce dossier de raccordement`,
  async function (this: PotentielWorld, dateMiseEnService: string) {
    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          this.raccordementWorld.référenceDossierRaccordement,
        ),
        dateMiseEnService: new Date(dateMiseEnService),
      },
    });
  },
);

Alors(
  `la date de mise en service {string} devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld, dateMiseEnService: string) {
    const actual = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      },
    });

    expect(actual.dateMiseEnService).to.equal(new Date(dateMiseEnService).toISOString());
  },
);

Quand(
  `un administrateur transmet une date de mise en service pour un projet n'ayant aucun dossier de raccordement`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement('dossier-inconnu'),
          dateMiseEnService: new Date('2023-03-15'),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `un administrateur transmet une date de mise en service pour un dossier de raccordement non référencé`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement('dossier-inconnu'),
          dateMiseEnService: new Date('2023-03-15'),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

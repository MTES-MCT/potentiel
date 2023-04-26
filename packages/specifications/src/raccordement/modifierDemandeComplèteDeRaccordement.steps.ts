import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  consulterDossierRaccordementQueryHandlerFactory,
  modifierDemandeComplèteRaccordementCommandHandlerFactory,
} from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { findProjection } from '@potentiel/pg-projections';
import { expect } from 'chai';

Quand(`le porteur modifie la date de qualification`, async function (this: PotentielWorld) {
  const modifierDemandeComplèteRaccordement =
    modifierDemandeComplèteRaccordementCommandHandlerFactory({
      loadAggregate,
      publish,
    });

  await modifierDemandeComplèteRaccordement({
    identifiantProjet: this.raccordementWorld.identifiantProjet,
    référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
    dateQualification: new Date('2023-04-26'),
  });
});

Alors(
  `la date de qualification du dossier de raccordement devrait être consultable`,
  async function (this: PotentielWorld) {
    const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    const actual = await consulterDossierRaccordement({
      référence: this.raccordementWorld.référenceDossierRaccordement,
    });

    expect(actual.dateQualification).to.equal(new Date('2023-04-26').toISOString());
  },
);

Quand(
  `un administrateur modifie la date de qualification pour un dossier de raccordement non connu`,
  async function (this: PotentielWorld) {
    try {
      const modifierDemandeComplèteRaccordement =
        modifierDemandeComplèteRaccordementCommandHandlerFactory({
          loadAggregate,
          publish,
        });

      await modifierDemandeComplèteRaccordement({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: 'dossier-inconnu',
        dateQualification: new Date('2023-04-26'),
      });
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

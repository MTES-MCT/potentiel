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

Quand(
  `le porteur modifie la date de qualification au {string} et une nouvelle référence {string}`,
  async function (this: PotentielWorld, dateQualification: string, nouvelleReference: string) {
    const modifierDemandeComplèteRaccordement =
      modifierDemandeComplèteRaccordementCommandHandlerFactory({
        loadAggregate,
        publish,
      });

    await modifierDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      dateQualification: new Date(dateQualification),
      referenceActuelle: this.raccordementWorld.référenceDossierRaccordement,
      nouvelleReference,
    });
  },
);

Alors(
  `la date de qualification {string} et la référence {string} devraient être consultables dans un nouveau dossier de raccordement`,
  async function (this: PotentielWorld, dateQualification: string, nouvelleReference: string) {
    const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    const actual = await consulterDossierRaccordement({
      référence: nouvelleReference,
    });

    expect(actual.dateQualification).to.equal(new Date(dateQualification).toISOString());
  },
);

Alors(
  `l'ancien dossier de raccordement ne devrait plus être consultable`,
  async function (this: PotentielWorld) {
    const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    try {
      await consulterDossierRaccordement({
        référence: this.raccordementWorld.référenceDossierRaccordement,
      });
    } catch (error) {
      expect(error).to.be.instanceOf(DossierRaccordementNonRéférencéError);
    }
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
        dateQualification: new Date('2023-04-26'),
        referenceActuelle: 'dossier-inconnu',
        nouvelleReference: 'nouvelle-reference',
      });
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

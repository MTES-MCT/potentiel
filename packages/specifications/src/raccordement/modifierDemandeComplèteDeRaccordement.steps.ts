import { Given as EtantDonné, When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  buildConsulterDemandeComplèteRaccordementUseCase,
  buildModifierDemandeComplèteRaccordementUseCase,
} from '@potentiel/domain';
import { expect } from 'chai';
import { mediator } from 'mediateur';
import { Readable } from 'stream';

/**
 * SCENARIO-01
 */
Quand(
  `le porteur modifie la date de qualification d'un dossier de raccordement`,
  async function (this: PotentielWorld) {
    const dateQualification = new Date('2021-01-01');

    await mediator.send(
      buildModifierDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        dateQualification: new Date(dateQualification),
        ancienneRéférenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        nouvelleRéférenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        nouvelAccuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
      }),
    );

    this.raccordementWorld.dateQualification = dateQualification;
  },
);

/**
 * SCENARIO-02
 */
Quand(
  `le porteur modifie une demande complète de raccordement`,
  async function (this: PotentielWorld) {
    const nouvelleRéférenceDossierRaccordement = 'UNE-NOUVELLE-REFERENCE-DCR';
    const dateQualification = new Date('2023-01-01');
    const nouvelAccuséRéception = {
      format: 'text/plain',
      content: Readable.from("Contenu d'un nouveau fichier", {
        encoding: 'utf-8',
      }),
    };
    await mediator.send(
      buildModifierDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        dateQualification,
        ancienneRéférenceDossierRaccordement:
          this.raccordementWorld.ancienneRéférenceDossierRaccordement,
        nouvelleRéférenceDossierRaccordement,
        nouvelAccuséRéception,
      }),
    );

    this.raccordementWorld.référenceDossierRaccordement = nouvelleRéférenceDossierRaccordement;
    this.raccordementWorld.dateQualification = dateQualification;
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = nouvelAccuséRéception;
  },
);

/**
 * SCENARIO-03
 */
EtantDonné(
  `un dossier de raccordement ayant une proposition technique et financière`,
  async function (this: PotentielWorld) {},
);

/**
 * SCENARIO-04
 */
Quand(
  `le porteur modifie une demande complète de raccordement avec la même référence mais un accusé de réception différent`,
  async function (this: PotentielWorld) {
    const nouvelAccuséRéception = {
      format: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
      content: Readable.from('Un nouveau contenu', {
        encoding: 'utf-8',
      }),
    };

    await mediator.send(
      buildModifierDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        dateQualification: this.raccordementWorld.dateQualification,
        ancienneRéférenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        nouvelleRéférenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        nouvelAccuséRéception,
      }),
    );

    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = nouvelAccuséRéception;
  },
);

Alors(`l'accusé de réception devrait être mis à jour`, async function (this: PotentielWorld) {
  const fichier = await mediator.send(
    buildConsulterDemandeComplèteRaccordementUseCase({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      référenceDossierRaccordement: this.raccordementWorld.ancienneRéférenceDossierRaccordement,
    }),
  );

  expect(fichier.format).to.be.equal(
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
  );
});

/**
 * SCENARIO-04
 */
Quand(
  `un administrateur modifie la date de qualification pour un dossier de raccordement non connu`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildModifierDemandeComplèteRaccordementUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          dateQualification: new Date('2023-04-26'),
          ancienneRéférenceDossierRaccordement: 'dossier-inconnu',
          nouvelleRéférenceDossierRaccordement: 'nouvelle-reference',
          nouvelAccuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
        }),
      );
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

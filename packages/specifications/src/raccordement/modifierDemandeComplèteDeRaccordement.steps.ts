import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  buildConsulterDemandeComplèteRaccordementUseCase,
  buildConsulterDossierRaccordementUseCase,
  buildModifierDemandeComplèteRaccordementUseCase,
} from '@potentiel/domain';
import { expect } from 'chai';
import { mediator } from 'mediateur';

/**
 * SCENARIO-01
 */
Quand(
  `le porteur modifie la date de qualification d'un dossier de raccordement sans modifier la réference du dossier ni l'accusé de réception`,
  async function (this: PotentielWorld) {
    const dateQualification = new Date('2021-01-01');

    await mediator.send(
      buildModifierDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        dateQualification: new Date(dateQualification),
        ancienneRéférence: this.raccordementWorld.référenceDossierRaccordement,
        nouvelleRéférence: this.raccordementWorld.référenceDossierRaccordement,
        accuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
      }),
    );

    this.raccordementWorld.dateQualification = dateQualification;
  },
);

Alors(
  `l'accusé de réception de la demande complète de raccordement devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld) {
    const { dateQualification, accuséRéception } = await mediator.send(
      buildConsulterDossierRaccordementUseCase({
        référence: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    expect(dateQualification).to.be.equal(this.raccordementWorld.dateQualification.toISOString());
    expect(accuséRéception?.format).to.be.equal(
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
    );

    const accuséRéceptionDemandeComplèteRaccordement = await mediator.send(
      buildConsulterDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      }),
    );

    expect(accuséRéceptionDemandeComplèteRaccordement.format).to.be.equal(
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
    );
    expect(accuséRéceptionDemandeComplèteRaccordement.content.toString()).to.be.equal(
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.content.toString(),
    );
  },
);

/**
 * SCENARIO-02
 */
Quand(
  `le porteur modifie une demande complète de raccordement avec une référence du dossier de raccordement différente et un accusé de réception identique`,
  async function (this: PotentielWorld) {
    const nouvelleRéférence = 'UNE-NOUVELLE-REFERENCE-DCR';
    await mediator.send(
      buildModifierDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        dateQualification: this.raccordementWorld.dateQualification,
        ancienneRéférence: this.raccordementWorld.ancienneRéférenceDossierRaccordement,
        nouvelleRéférence,
        accuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
      }),
    );

    this.raccordementWorld.référenceDossierRaccordement = nouvelleRéférence;
  },
);
Alors(`l'accusé de réception devrait être mis à jour`, async function (this: PotentielWorld) {
  const accuséRéceptionDemandeComplèteRaccordement = await mediator.send(
    buildConsulterDemandeComplèteRaccordementUseCase({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
    }),
  );

  expect(accuséRéceptionDemandeComplèteRaccordement.format).to.be.equal(
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
  );
  expect(accuséRéceptionDemandeComplèteRaccordement.content.toString()).to.be.equal(
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.content.toString(),
  );
});

// Quand(
//   `le porteur modifie une demande complète de raccordement`,
//   async function (this: PotentielWorld) {
//     const dateQualification = new Date('2023-04-26');
//     const nouvelleRéférence = 'une_nouvelle_référence';
//     const accuséRéception = {
//       format: 'application/pdf',
//       content: Readable.from("Contenu d'un autre fichier DCR", {
//         encoding: 'utf8',
//       }),
//     };

//     await mediator.send(
//       buildModifierDemandeComplèteRaccordementUseCase({
//         identifiantProjet: this.raccordementWorld.identifiantProjet,
//         dateQualification: new Date(dateQualification),
//         ancienneRéférence: this.raccordementWorld.référenceDossierRaccordement,
//         nouvelleRéférence,
//         accuséRéception,
//       }),
//     );

//     this.raccordementWorld.référenceDossierRaccordement = nouvelleRéférence;
//     this.raccordementWorld.dateQualification = dateQualification;
//     this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = accuséRéception;
//   },
// );

// Quand(
//   `le porteur modifie une demande complète de raccordement avec une référence du dossier de raccordement différente`,
//   async function (this: PotentielWorld) {
//     const nouvelleRéférence = 'une_nouvelle_référence';

//     await mediator.send(
//       buildModifierDemandeComplèteRaccordementUseCase({
//         identifiantProjet: this.raccordementWorld.identifiantProjet,
//         dateQualification: this.raccordementWorld.dateQualification,
//         ancienneRéférence: this.raccordementWorld.référenceDossierRaccordement,
//         nouvelleRéférence,
//         accuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
//       }),
//     );

//     this.raccordementWorld.référenceDossierRaccordement = nouvelleRéférence;
//   },
// );

// Alors(
//   `l'ancien accusé de réception de la demande complète de raccordement devrait être supprimé`,
//   async function (this: PotentielWorld) {
//     // const { dateQualification, accuséRéception } = await mediator.send(
//     //   buildConsulterDossierRaccordementUseCase({
//     //     référence: this.raccordementWorld.référenceDossierRaccordement,
//     //     identifiantProjet: this.raccordementWorld.identifiantProjet,
//     //   }),
//     // );
//     // expect(dateQualification).to.be.equal(this.raccordementWorld.dateQualification.toISOString());
//     // expect(accuséRéception?.format).to.be.equal(
//     //   this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
//     // );
//     // const accuséRéceptionDemandeComplèteRaccordement = await mediator.send(
//     //   buildConsulterDemandeComplèteRaccordementUseCase({
//     //     identifiantProjet: this.raccordementWorld.identifiantProjet,
//     //     référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
//     //   }),
//     // );
//     // // TODO improve assert
//     // accuséRéceptionDemandeComplèteRaccordement.should.be.ok;
//   },
// );

/**
 * SCENARIO-05
 */
Quand(
  `un administrateur modifie la date de qualification pour un dossier de raccordement non connu`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildModifierDemandeComplèteRaccordementUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          dateQualification: new Date('2023-04-26'),
          ancienneRéférence: 'dossier-inconnu',
          nouvelleRéférence: 'nouvelle-reference',
          accuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
        }),
      );
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

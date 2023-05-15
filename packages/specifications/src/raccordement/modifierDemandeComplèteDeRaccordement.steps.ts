import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  consulterDossierRaccordementQueryHandlerFactory,
  formatIdentifiantProjet,
  listerDossiersRaccordementQueryHandlerFactory,
  modifierDemandeComplèteRaccordementCommandHandlerFactory,
} from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { findProjection } from '@potentiel/pg-projections';
import { expect } from 'chai';
import { remplacerAccuséRéceptionDemandeComplèteRaccordement } from '@potentiel/adapter-domain';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';

Quand(
  `le porteur modifie la date de qualification au {string} et une nouvelle référence {string}`,
  async function (this: PotentielWorld, dateQualification: string, nouvelleRéférence: string) {
    const modifierDemandeComplèteRaccordement =
      modifierDemandeComplèteRaccordementCommandHandlerFactory({
        loadAggregate,
        publish,
        remplacerAccuséRéceptionDemandeComplèteRaccordement,
      });

    await modifierDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      dateQualification: new Date(dateQualification),
      ancienneRéférence: this.raccordementWorld.référenceDossierRaccordement,
      nouvelleRéférence,
      nouveauFichier: this.raccordementWorld.accuséRéception,
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
      identifiantProjet: this.raccordementWorld.identifiantProjet,
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
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référence: this.raccordementWorld.référenceDossierRaccordement,
      });
    } catch (error) {
      expect(error).to.be.instanceOf(DossierRaccordementNonRéférencéError);
    }
  },
);

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet avec comme référence {string}`,
  async function (this: PotentielWorld, nouvelleReference: string) {
    const listerDossiersRaccordement = listerDossiersRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    const actual = await listerDossiersRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
    });
    actual.références.should.contain(nouvelleReference);
  },
);

Alors(
  `l'accusé de réception devrait être enregistré et consultable pour ce dossier de raccordement pour la nouvelle référence {string}`,
  async function (this: PotentielWorld, nouvelleRéférence: string) {
    const path = join(
      formatIdentifiantProjet(this.raccordementWorld.identifiantProjet),
      nouvelleRéférence,
      `demande-complete-raccordement.${extension(this.raccordementWorld.accuséRéception.format)}`,
    );
    const fichier = await download(path);
    fichier.should.be.ok;
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
          remplacerAccuséRéceptionDemandeComplèteRaccordement,
        });

      await modifierDemandeComplèteRaccordement({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        dateQualification: new Date('2023-04-26'),
        ancienneRéférence: 'dossier-inconnu',
        nouvelleRéférence: 'nouvelle-reference',
        nouveauFichier: this.raccordementWorld.accuséRéception,
      });
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

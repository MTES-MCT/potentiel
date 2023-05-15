import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  consulterDossierRaccordementQueryHandlerFactory,
  formatIdentifiantProjet,
  createConsulterDossierRaccordementQuery,
  createTransmettrePropositionTechniqueEtFinancièreCommand,
  newConsulterDossierRaccordementQuery,
  newTransmettrePropositionTechniqueEtFinancièreCommand,
} from '@potentiel/domain';
import { expect } from 'chai';
import { join } from 'path';
import { extension } from 'mime-types';
import { download } from '@potentiel/file-storage';
import { enregistrerFichierPropositionTechniqueEtFinancière } from '@potentiel/adapter-domain';
import { mediator } from 'mediateur';

Quand(
  `le porteur de projet transmet une proposition technique et financière pour ce dossier de raccordement avec la date de signature au {string}`,
  async function (this: PotentielWorld, dateSignature: string) {
    const transmettrePropositionTechniqueEtFinancière =
      transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory({
        loadAggregate,
        publish,
        enregistrerFichierPropositionTechniqueEtFinancière,
      });

    await transmettrePropositionTechniqueEtFinancière({
      dateSignature: new Date(dateSignature),
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      propositionTechniqueEtFinancière:
        this.raccordementWorld.fichierPropositionTechniqueEtFinancière,
    });
    await mediator.send(
      newTransmettrePropositionTechniqueEtFinancièreCommand({
        dateSignature: new Date(dateSignature),
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );
  },
);

Alors(
  `une proposition technique et financière devrait être consultable dans le dossier de raccordement avec une date de signature au {string}`,
  async function (this: PotentielWorld, dateSignature: string) {
    const dateSignatureISOString = new Date(dateSignature).toISOString();
    const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    const actual = await consulterDossierRaccordement({
      référence: this.raccordementWorld.référenceDossierRaccordement,
      identifiantProjet: this.raccordementWorld.identifiantProjet,
    });
    const actual = await mediator.send(
      newConsulterDossierRaccordementQuery({
        référence: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    const expected = {
      dateSignature: dateSignatureISOString,
      format: this.raccordementWorld.fichierPropositionTechniqueEtFinancière.format,
    };

    expect(actual.propositionTechniqueEtFinancière).to.deep.equal(expected);
  },
);

Quand(
  `un administrateur transmet une proposition technique et financière pour un projet n'ayant aucun dossier de raccordement`,
  async function (this: PotentielWorld) {
    const transmettrePropositionTechniqueEtFinancière =
      transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory({
        loadAggregate,
        publish,
        enregistrerFichierPropositionTechniqueEtFinancière,
      });

    try {
      await transmettrePropositionTechniqueEtFinancière({
        dateSignature: new Date(),
        référenceDossierRaccordement: 'dossier-inconnu',
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        propositionTechniqueEtFinancière:
          this.raccordementWorld.fichierPropositionTechniqueEtFinancière,
      });
    try {
      await mediator.send(
        newTransmettrePropositionTechniqueEtFinancièreCommand({
          dateSignature: new Date(),
          référenceDossierRaccordement: 'dossier-inconnu',
          identifiantProjet: this.raccordementWorld.identifiantProjet,
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
  `un administrateur transmet une proposition technique et financière pour un dossier de raccordement non référencé`,
  async function (this: PotentielWorld) {
    const transmettrePropositionTechniqueEtFinancière =
      transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory({
        loadAggregate,
        publish,
        enregistrerFichierPropositionTechniqueEtFinancière,
      });

    try {
      await transmettrePropositionTechniqueEtFinancière({
        dateSignature: new Date(),
        référenceDossierRaccordement: 'dossier-inconnu',
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        propositionTechniqueEtFinancière:
          this.raccordementWorld.fichierPropositionTechniqueEtFinancière,
      });
    try {
      await mediator.send(
        newTransmettrePropositionTechniqueEtFinancièreCommand({
          dateSignature: new Date(),
          référenceDossierRaccordement: 'dossier-inconnu',
          identifiantProjet: this.raccordementWorld.identifiantProjet,
        }),
      );
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

Alors(
  `le fichier  devrait être enregistré et consultable pour ce dossier de raccordement`,
  async function (this: PotentielWorld) {
    const path = join(
      formatIdentifiantProjet(this.raccordementWorld.identifiantProjet),
      this.raccordementWorld.référenceDossierRaccordement,
      `proposition-technique-et-financiere.${extension(
        this.raccordementWorld.fichierPropositionTechniqueEtFinancière.format,
      )}`,
    );
    const fichier = await download(path);
    fichier.should.be.ok;
  },
);
//

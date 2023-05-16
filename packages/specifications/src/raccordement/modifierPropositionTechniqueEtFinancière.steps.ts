import { When as Quand, Then as Alors } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import {
  DossierRaccordementNonRéférencéError,
  consulterDossierRaccordementQueryHandlerFactory,
  formatIdentifiantProjet,
  createConsulterDossierRaccordementQuery,
  createModifierPropositionTechniqueEtFinancièreCommand,
  newConsulterDossierRaccordementQuery,
  newModifierPropositionTechniqueEtFinancièreCommand,
  buildConsulterDossierRaccordementQuery,
  buildModifierPropositionTechniqueEtFinancièreCommand,
} from '@potentiel/domain';
import { expect } from 'chai';
import { download } from '@potentiel/file-storage';
import { extension } from 'mime-types';
import { join } from 'path';
import { enregistrerFichierPropositionTechniqueEtFinancière } from '@potentiel/adapter-domain';
import { mediator } from 'mediateur';

Quand(
  `le porteur modifie la proposition technique et financière avec une date de signature au {string} et un nouveau fichier`,
  async function (this: PotentielWorld, dateSignature: string) {
    const modifierPropositionTechniqueEtFinancière =
      modifierPropositionTechniqueEtFinancièreCommandHandlerFactory({
        loadAggregate,
        publish,
        enregistrerFichierPropositionTechniqueEtFinancière,
      });

    await modifierPropositionTechniqueEtFinancière({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      dateSignature: new Date(dateSignature),
      nouveauFichier: this.raccordementWorld.autreFichierPropositionTechniqueEtFinancière,
    });
    await mediator.send(
      buildModifierPropositionTechniqueEtFinancièreCommand({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        dateSignature: new Date(dateSignature),
      }),
    );
  },
);

Alors(
  `la date de signature {string} et le format du fichier devraient être consultables dans le dossier de raccordement`,
  async function (this: PotentielWorld, dateSignature: string) {
    const actual = await mediator.send(
      buildConsulterDossierRaccordementQuery({
        référence: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    console.log('********************* ACTUAL', actual);

    expect(actual.propositionTechniqueEtFinancière).to.deep.equal({
      dateSignature: new Date(dateSignature).toISOString(),
      format: this.raccordementWorld.autreFichierPropositionTechniqueEtFinancière.format,
    });
  },
);

Alors(
  `le nouveau fichier devrait être enregistré et consultable pour ce dossier de raccordement`,
  async function (this: PotentielWorld) {
    const path = join(
      formatIdentifiantProjet(this.raccordementWorld.identifiantProjet),
      this.raccordementWorld.référenceDossierRaccordement,
      `proposition-technique-et-financiere.${extension(
        this.raccordementWorld.autreFichierPropositionTechniqueEtFinancière.format,
      )}`,
    );
    const fichier = await download(path);
    fichier.should.be.ok;
  },
);

Quand(
  `un administrateur modifie la date de signature pour un dossier de raccordement non connu`,
  async function (this: PotentielWorld) {
    try {
      const modifierPropositionTechniqueEtFinancière =
        modifierPropositionTechniqueEtFinancièreCommandHandlerFactory({
          loadAggregate,
          publish,
          enregistrerFichierPropositionTechniqueEtFinancière,
        });

      await modifierPropositionTechniqueEtFinancière({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        dateSignature: new Date('2023-04-26'),
        référenceDossierRaccordement: 'dossier-inconnu',
        nouveauFichier: this.raccordementWorld.autreFichierPropositionTechniqueEtFinancière,
      });
      await mediator.send(
        buildModifierPropositionTechniqueEtFinancièreCommand({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          dateSignature: new Date('2023-04-26'),
          référenceDossierRaccordement: 'dossier-inconnu',
        }),
      );
    } catch (error) {
      if (error instanceof DossierRaccordementNonRéférencéError) {
        this.error = error;
      }
    }
  },
);

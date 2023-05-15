import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  DossierRaccordementReadModel,
  GestionnaireNonRéférencéError,
  PlusieursGestionnairesRéseauPourUnProjetError,
  consulterDossierRaccordementQueryHandlerFactory,
  consulterProjetQueryHandlerFactory,
  formatIdentifiantProjet,
  listerDossiersRaccordementQueryHandlerFactory,
  transmettreDemandeComplèteRaccordementCommandHandlerFactory,
  transmettreDemandeComplèteRaccordementUseCaseFactory,
  createConsulterProjetQuery,
  createConsulterDossierRaccordementQuery,
  createListerDossiersRaccordementQuery,
  transmettreDemandeComplèteRaccordementUseCase,
} from '@potentiel/domain';
import { PotentielWorld } from '../potentiel.world';
import { download } from '@potentiel/file-storage';
import { Readable } from 'stream';
import { join } from 'path';
import { extension } from 'mime-types';
import { enregistrerAccuséRéceptionDemandeComplèteRaccordement } from '@potentiel/adapter-domain';
import { mediator } from 'mediateur';

EtantDonné(
  "un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau avec :",
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']);
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];

    await transmettreDemandeComplèteRaccordementUseCase({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
      },
      dateQualification,
      référenceDossierRaccordement,
      accuséRéception: this.raccordementWorld.fichierDemandeComplèteRaccordement,
    });
  },
);

Quand(
  `le porteur du projet transmet une autre demande complète de raccordement auprès du même gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    this.raccordementWorld.dateQualification = new Date(exemple['La date de qualification']);
    this.raccordementWorld.référenceDossierRaccordement =
      exemple['La référence du dossier de raccordement'];

    await transmettreDemandeComplèteRaccordementUseCase({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
      },
      dateQualification: this.raccordementWorld.dateQualification,
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      accuséRéception: {
        format: 'application/pdf',
        content: Readable.from("Contenu d'un autre fichier", {
          encoding: 'utf8',
        }),
      },
    });
  },
);

Quand(
  `le porteur d'un projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    this.raccordementWorld.dateQualification = new Date(exemple['La date de qualification']);
    this.raccordementWorld.référenceDossierRaccordement =
      exemple['La référence du dossier de raccordement'];

    await transmettreDemandeComplèteRaccordementUseCase({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
      },
      dateQualification: this.raccordementWorld.dateQualification,
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      accuséRéception: this.raccordementWorld.fichierDemandeComplèteRaccordement,
    });
  },
);

Quand(
  `le porteur du projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau non référencé`,
  async function (this: PotentielWorld) {
    try {
      await transmettreDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        identifiantGestionnaireRéseau: {
          codeEIC: 'gestionnaire-de-réseau-inconnu',
        },
        dateQualification: new Date(),
        référenceDossierRaccordement: 'une référence',
        accuséRéception: this.raccordementWorld.fichierDemandeComplèteRaccordement,
      });
    } catch (e) {
      if (e instanceof GestionnaireNonRéférencéError) {
        this.error = e;
      }
    }
  },
);

Alors(
  'le projet devrait avoir {int} dossiers de raccordement pour ce gestionnaire de réseau',
  async function (this: PotentielWorld, nombreDeDemandes: number) {
    const actual = await mediator.send(
      createListerDossiersRaccordementQuery({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    actual.références.should.length(nombreDeDemandes);
  },
);

Alors(
  'le projet devrait avoir un dossier de raccordement pour ce gestionnaire de réseau',
  async function async(this: PotentielWorld) {
    const actual = await mediator.send(
      createConsulterDossierRaccordementQuery({
        référence: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    const expected: DossierRaccordementReadModel = {
      type: 'dossier-raccordement',
      référence: this.raccordementWorld.référenceDossierRaccordement,
      dateQualification: this.raccordementWorld.dateQualification.toISOString(),
      accuséRéception: { format: this.raccordementWorld.fichierDemandeComplèteRaccordement.format },
    };

    actual.should.be.deep.equal(expected);

    const {
      identifiantGestionnaire = {
        codeEIC: '',
      },
    } = await mediator.send(
      createConsulterProjetQuery({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    identifiantGestionnaire.should.be.deep.equal({
      codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
    });
  },
);

Alors(
  'le dossier est consultable dans la liste des dossiers de raccordement du projet',
  async function (this: PotentielWorld) {
    const listerDossiersRaccordement = listerDossiersRaccordementQueryHandlerFactory({
      find: findProjection,
    });
  async function async(this: PotentielWorld) {
    const actual = await mediator.send(
      createListerDossiersRaccordementQuery({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    actual.références.should.contain(this.raccordementWorld.référenceDossierRaccordement);
  },
);

Alors(
  `l'accusé de réception devrait être enregistré et consultable pour ce dossier de raccordement`,
  async function (this: PotentielWorld) {
    // TODO : utiliser query
    const path = join(
      formatIdentifiantProjet(this.raccordementWorld.identifiantProjet),
      this.raccordementWorld.référenceDossierRaccordement,
      `demande-complete-raccordement.${extension(
        this.raccordementWorld.fichierDemandeComplèteRaccordement.format,
      )}`,
    );
    const fichier = await download(path);
    fichier.should.be.ok;
  },
);

EtantDonné(
  `un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const transmettreDemandeComplèteRaccordementUseCase = getUseCase();
    await transmettreDemandeComplèteRaccordementUseCase({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
      },
      dateQualification: new Date('2022-12-31'),
      référenceDossierRaccordement: 'UNE-REFERENCE-DCR',
      accuséRéception: this.raccordementWorld.fichierDemandeComplèteRaccordement,
    });
  },
);

Quand(
  `le porteur du projet transmet une demande complète de raccordement auprès d'un autre gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const codeEICAutreGDR = 'UN-AUTRE-GDR';
    await this.gestionnaireRéseauWorld.createGestionnaireRéseau(
      codeEICAutreGDR,
      'Un autre gestionnaire',
    );

    try {
      await transmettreDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        identifiantGestionnaireRéseau: {
          codeEIC: codeEICAutreGDR,
        },
        dateQualification: new Date('2022-11-24'),
        référenceDossierRaccordement: 'Enieme-DCR',
        accuséRéception: this.raccordementWorld.fichierDemandeComplèteRaccordement,
      });
    } catch (error) {
      if (error instanceof PlusieursGestionnairesRéseauPourUnProjetError) {
        this.error = error;
      }
    }
  },
);

function getUseCase() {
  const transmettreDemandeComplèteRaccordementCommand =
    transmettreDemandeComplèteRaccordementCommandHandlerFactory({
      loadAggregate,
      publish,
    });

  const transmettreDemandeComplèteRaccordementUseCase =
    transmettreDemandeComplèteRaccordementUseCaseFactory({
      transmettreDemandeComplèteRaccordementCommand,
      enregistrerAccuséRéceptionDemandeComplèteRaccordement,
    });
  return transmettreDemandeComplèteRaccordementUseCase;
}

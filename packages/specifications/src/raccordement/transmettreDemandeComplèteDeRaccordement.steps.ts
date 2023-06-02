import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import {
  DossierRaccordementReadModel,
  PlusieursGestionnairesRéseauPourUnProjetError,
  buildConsulterDossierRaccordementUseCase,
  buildConsulterProjetUseCase,
  buildListerDossiersRaccordementUseCase,
  buildTransmettreDemandeComplèteRaccordementUseCase,
} from '@potentiel/domain';
import { PotentielWorld } from '../potentiel.world';
import { Readable } from 'stream';
import { mediator } from 'mediateur';

EtantDonné(
  "un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau avec :",
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']);
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];

    await mediator.send(
      buildTransmettreDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        identifiantGestionnaireRéseau: {
          codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
        },
        dateQualification,
        référenceDossierRaccordement,
        nouvelAccuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
      }),
    );
  },
);

Quand(
  `le porteur du projet transmet une autre demande complète de raccordement auprès du même gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    this.raccordementWorld.dateQualification = new Date(exemple['La date de qualification']);
    this.raccordementWorld.référenceDossierRaccordement =
      exemple['La référence du dossier de raccordement'];
    try {
      await mediator.send(
        buildTransmettreDemandeComplèteRaccordementUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          identifiantGestionnaireRéseau: {
            codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
          },
          dateQualification: this.raccordementWorld.dateQualification,
          référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
          nouvelAccuséRéception: {
            format: 'application/pdf',
            content: Readable.from("Contenu d'un autre fichier", {
              encoding: 'utf8',
            }),
          },
        }),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur d'un projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    this.raccordementWorld.dateQualification = new Date(exemple['La date de qualification']);
    this.raccordementWorld.référenceDossierRaccordement =
      exemple['La référence du dossier de raccordement'];

    try {
      await mediator.send(
        buildTransmettreDemandeComplèteRaccordementUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          identifiantGestionnaireRéseau: {
            codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
          },
          dateQualification: this.raccordementWorld.dateQualification,
          référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
          nouvelAccuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
        }),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur du projet transmet une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildTransmettreDemandeComplèteRaccordementUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          identifiantGestionnaireRéseau: {
            codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
          },
          dateQualification: new Date(),
          référenceDossierRaccordement: 'une référence avec un format invalide',
          nouvelAccuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
        }),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur du projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau non référencé`,
  async function (this: PotentielWorld) {
    try {
      await mediator.send(
        buildTransmettreDemandeComplèteRaccordementUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          identifiantGestionnaireRéseau: {
            codeEIC: 'gestionnaire-de-réseau-inconnu',
          },
          dateQualification: new Date(),
          référenceDossierRaccordement: 'une référence',
          nouvelAccuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
        }),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Alors(
  'le projet devrait avoir {int} dossiers de raccordement pour ce gestionnaire de réseau',
  async function (this: PotentielWorld, nombreDeDemandes: number) {
    const actual = await mediator.send(
      buildListerDossiersRaccordementUseCase({
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
      buildConsulterDossierRaccordementUseCase({
        référence: this.raccordementWorld.référenceDossierRaccordement,
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    const expected: DossierRaccordementReadModel = {
      type: 'dossier-raccordement',
      référence: this.raccordementWorld.référenceDossierRaccordement,
      dateQualification: this.raccordementWorld.dateQualification.toISOString(),
      accuséRéception: {
        format: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
      },
    };

    actual.should.be.deep.equal(expected);

    const {
      identifiantGestionnaire = {
        codeEIC: '',
      },
    } = await mediator.send(
      buildConsulterProjetUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      }),
    );

    identifiantGestionnaire.should.be.deep.equal({
      codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
    });
  },
);

EtantDonné(
  `un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    await mediator.send(
      buildTransmettreDemandeComplèteRaccordementUseCase({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        identifiantGestionnaireRéseau: {
          codeEIC: this.gestionnaireRéseauWorld.enedis.codeEIC,
        },
        dateQualification: new Date('2022-12-31'),
        référenceDossierRaccordement: 'XXX-RP-2021-999999',
        nouvelAccuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
      }),
    );
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
      await mediator.send(
        buildTransmettreDemandeComplèteRaccordementUseCase({
          identifiantProjet: this.raccordementWorld.identifiantProjet,
          identifiantGestionnaireRéseau: {
            codeEIC: codeEICAutreGDR,
          },
          dateQualification: new Date('2022-11-24'),
          référenceDossierRaccordement: 'Enieme-DCR',
          nouvelAccuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
        }),
      );
    } catch (error) {
      if (error instanceof PlusieursGestionnairesRéseauPourUnProjetError) {
        this.error = error;
      }
    }
  },
);

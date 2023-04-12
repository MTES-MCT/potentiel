import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import {
  transmettreDemandeComplèteRaccordementCommandHandlerFactory,
  consulterDossierRaccordementQueryHandlerFactory,
  listerDossiersRaccordementQueryHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { PotentielWorld } from '../potentiel.world';
import { DossierRaccordementReadModel } from '@potentiel/domain/src/raccordement/consulter/dossierRaccordement.readModel';

EtantDonné(
  "un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau avec :",
  async function (this: PotentielWorld, table: DataTable) {
    await this.gestionnaireRéseauWorld.createGestionnaireRéseau(
      this.raccordementWorld.enedis.codeEIC,
      this.raccordementWorld.enedis.raisonSociale,
    );
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']);
    const référenceDemandeRaccordement = exemple['La référence de la demande de raccordement'];

    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        loadAggregate,
        publish,
      });

    await transmettreDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.raccordementWorld.enedis.codeEIC,
      },
      dateQualification,
      référenceDossierRaccordement: référenceDemandeRaccordement,
    });
  },
);

Quand(
  `le porteur du projet transmet une autre demande complète de raccordement auprès du même gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    this.raccordementWorld.dateQualification = new Date(exemple['La date de qualification']);
    this.raccordementWorld.référenceDossierRaccordement =
      exemple['La référence de la demande de raccordement'];

    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        loadAggregate,
        publish,
      });

    await transmettreDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.raccordementWorld.enedis.codeEIC,
      },
      dateQualification: this.raccordementWorld.dateQualification,
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
    });
  },
);

Quand(
  `le porteur d'un projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, table: DataTable) {
    await this.gestionnaireRéseauWorld.createGestionnaireRéseau(
      this.raccordementWorld.enedis.codeEIC,
      this.raccordementWorld.enedis.raisonSociale,
    );
    const exemple = table.rowsHash();
    this.raccordementWorld.dateQualification = new Date(exemple['La date de qualification']);
    this.raccordementWorld.référenceDossierRaccordement =
      exemple['La référence de la demande de raccordement'];

    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        loadAggregate,
        publish,
      });

    await transmettreDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.raccordementWorld.enedis.codeEIC,
      },
      dateQualification: this.raccordementWorld.dateQualification,
      référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
    });
  },
);

Alors(
  'le projet devrait avoir {int} demandes complètes de raccordement pour ce gestionnaire de réseau',
  async function (this: PotentielWorld, nombreDeDemandes: number) {
    const listerDemandeComplèteRaccordement = listerDossiersRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    await waitForExpect(async () => {
      const actual = await listerDemandeComplèteRaccordement({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      });

      actual.gestionnaireRéseau.should.be.deep.equal(this.raccordementWorld.enedis);
      actual.références.should.length(nombreDeDemandes);
    });
  },
);

Alors(
  'le projet devrait avoir une demande complète de raccordement pour ce gestionnaire de réseau',
  async function async(this: PotentielWorld) {
    const consulterDossierRaccordement = consulterDossierRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    await waitForExpect(async () => {
      const actual = await consulterDossierRaccordement({
        référence: this.raccordementWorld.référenceDossierRaccordement,
      });

      const expected: DossierRaccordementReadModel = {
        type: 'dossier-raccordement',
        référence: this.raccordementWorld.référenceDossierRaccordement,
        gestionnaireRéseau: this.raccordementWorld.enedis,
        dateQualification: this.raccordementWorld.dateQualification.toISOString(),
      };

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  'la demande est consultable dans la liste des demandes complètes de raccordement du projet',
  async function async(this: PotentielWorld) {
    const listerDossiersRaccordement = listerDossiersRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    await waitForExpect(async () => {
      const actual = await listerDossiersRaccordement({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      });
      actual.gestionnaireRéseau.should.be.deep.equal(this.raccordementWorld.enedis);
      actual.références.should.contain(this.raccordementWorld.référenceDossierRaccordement);
    });
  },
);

EtantDonné(
  `un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    await this.gestionnaireRéseauWorld.createGestionnaireRéseau(
      this.raccordementWorld.enedis.codeEIC,
      this.raccordementWorld.enedis.raisonSociale,
    );

    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        loadAggregate,
        publish,
      });

    await transmettreDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.raccordementWorld.enedis.codeEIC,
      },
      dateQualification: new Date('2022-12-31'),
      référenceDossierRaccordement: 'UNE-REFERENCE-DCR',
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

    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        loadAggregate,
        publish,
      });

    try {
      await transmettreDemandeComplèteRaccordement({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        identifiantGestionnaireRéseau: {
          codeEIC: codeEICAutreGDR,
        },
        dateQualification: new Date('2022-11-24'),
        référenceDossierRaccordement: 'Enieme-DCR',
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import { publish } from '@potentiel/pg-event-sourcing';
import {
  transmettreDemandeComplèteRaccordementCommandHandlerFactory,
  consulterDemandeComplèteRaccordementQueryHandlerFactory,
  listerDemandeComplèteRaccordementQueryHandlerFactory,
} from '@potentiel/domain';
import { findProjection } from '@potentiel/pg-projections';
import waitForExpect from 'wait-for-expect';
import { PotentielWorld } from '../potentiel.world';

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
        publish,
      });

    await transmettreDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.raccordementWorld.enedis.codeEIC,
      },
      dateQualification,
      référenceDemandeRaccordement,
    });
  },
);

Quand(
  `le porteur du projet transmet une autre demande complète de raccordement auprès du même gestionnaire de réseau avec :`,
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();
    this.raccordementWorld.dateQualification = new Date(exemple['La date de qualification']);
    this.raccordementWorld.référenceDemandeRaccordement =
      exemple['La référence de la demande de raccordement'];

    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        publish,
      });

    await transmettreDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.raccordementWorld.enedis.codeEIC,
      },
      dateQualification: this.raccordementWorld.dateQualification,
      référenceDemandeRaccordement: this.raccordementWorld.référenceDemandeRaccordement,
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
    this.raccordementWorld.référenceDemandeRaccordement =
      exemple['La référence de la demande de raccordement'];

    const transmettreDemandeComplèteRaccordement =
      transmettreDemandeComplèteRaccordementCommandHandlerFactory({
        publish,
      });

    await transmettreDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.raccordementWorld.enedis.codeEIC,
      },
      dateQualification: this.raccordementWorld.dateQualification,
      référenceDemandeRaccordement: this.raccordementWorld.référenceDemandeRaccordement,
    });
  },
);

Alors(
  'le projet devrait avoir {int} demandes complètes de raccordement pour ce gestionnaire de réseau',
  async function (this: PotentielWorld, nombreDeDemandes: number) {
    const listerDemandeComplèteRaccordement = listerDemandeComplèteRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    await waitForExpect(async () => {
      const actual = await listerDemandeComplèteRaccordement({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      });

      actual.gestionnaireRéseau.should.be.deep.equal(this.raccordementWorld.enedis);
      actual.référencesDemandeRaccordement.should.length(nombreDeDemandes);
    });
  },
);

Alors(
  'le projet devrait avoir une demande complète de raccordement pour ce gestionnaire de réseau',
  async function async(this: PotentielWorld) {
    const consulterDemandeComplèteRaccordement =
      consulterDemandeComplèteRaccordementQueryHandlerFactory({
        find: findProjection,
      });

    await waitForExpect(async () => {
      const actual = await consulterDemandeComplèteRaccordement({
        référenceDemandeRaccordement: this.raccordementWorld.référenceDemandeRaccordement,
      });

      actual.should.be.deep.equal({
        type: 'demande-complète-raccordement',
        référenceDemandeRaccordement: this.raccordementWorld.référenceDemandeRaccordement,
        gestionnaireRéseau: this.raccordementWorld.enedis,
        dateQualification: this.raccordementWorld.dateQualification.toISOString(),
      });
    });
  },
);

Alors(
  'la demande est consultable dans la liste des demandes complètes de raccordement du projet',
  async function async(this: PotentielWorld) {
    const listerDemandeComplèteRaccordement = listerDemandeComplèteRaccordementQueryHandlerFactory({
      find: findProjection,
    });

    await waitForExpect(async () => {
      const actual = await listerDemandeComplèteRaccordement({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      });
      actual.gestionnaireRéseau.should.be.deep.equal(this.raccordementWorld.enedis);
      actual.référencesDemandeRaccordement.should.contain(
        this.raccordementWorld.référenceDemandeRaccordement,
      );
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
        publish,
      });

    await transmettreDemandeComplèteRaccordement({
      identifiantProjet: this.raccordementWorld.identifiantProjet,
      identifiantGestionnaireRéseau: {
        codeEIC: this.raccordementWorld.enedis.codeEIC,
      },
      dateQualification: new Date('2022-12-31'),
      référenceDemandeRaccordement: 'UNE-REFERENCE-DCR',
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
        publish,
      });

    try {
      await transmettreDemandeComplèteRaccordement({
        identifiantProjet: this.raccordementWorld.identifiantProjet,
        identifiantGestionnaireRéseau: {
          codeEIC: codeEICAutreGDR,
        },
        dateQualification: new Date('2022-11-24'),
        référenceDemandeRaccordement: 'Enieme-DCR',
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

import { Given as EtantDonné, When as Quand, Then as Alors, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../potentiel.world';
import { Readable } from 'stream';
import { mediator } from 'mediateur';
import {
  DomainUseCase,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import {
  ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
  ConsulterDossierRaccordementQuery,
  DossierRaccordementReadModel,
  ListerDossiersRaccordementQuery,
} from '@potentiel/domain-views';
import { convertStringToReadable } from '../helpers/convertStringToReadable';
import { isNone } from '@potentiel/monads';
import { convertReadableToString } from '../helpers/convertReadableToString';

EtantDonné(
  'un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau {string} avec :',
  async function (this: PotentielWorld, raisonSociale, table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']);
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const accuséRéception = {
      format,
      content: convertStringToReadable(content),
    };

    const codeEIC = this.gestionnaireRéseauWorld.rechercherCodeEIC(raisonSociale);

    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(this.projetWorld.identifiantProjet),
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        dateQualification,
        accuséRéception,
      },
    });

    this.raccordementWorld.dateQualification = dateQualification;
    this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
      format,
      content,
    };
  },
);

Quand(
  `le porteur d'un projet transmet une demande complète de raccordement auprès du gestionnaire de réseau {string} avec :`,
  async function (this: PotentielWorld, raisonSociale: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']);
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const accuséRéception = {
      format,
      content: convertStringToReadable(content),
    };

    const codeEIC = this.gestionnaireRéseauWorld.rechercherCodeEIC(raisonSociale);

    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.projetWorld.identifiantProjet),
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          dateQualification,
          accuséRéception,
        },
      });

      this.raccordementWorld.dateQualification = dateQualification;
      this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
        format,
        content,
      };
    } catch (e) {
      this.error = e as Error;
    }
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
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.projetWorld.identifiantProjet),
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(
            this.gestionnaireRéseauWorld.codeEIC,
          ),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            this.raccordementWorld.référenceDossierRaccordement,
          ),
          dateQualification: this.raccordementWorld.dateQualification,
          accuséRéception: {
            format: 'application/pdf',
            content: Readable.from("Contenu d'un autre fichier", {
              encoding: 'utf8',
            }),
          },
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Alors(
  'le projet devrait avoir {int} dossiers de raccordement pour ce gestionnaire de réseau',
  async function (this: PotentielWorld, nombreDeDemandes: number) {
    const actual = await mediator.send<ListerDossiersRaccordementQuery>({
      type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.projetWorld.identifiantProjet,
      },
    });

    actual.références.should.length(nombreDeDemandes);
  },
);

Alors(
  `la demande complète de raccordement devrait être consultable dans le dossier de raccordement`,
  async function (this: PotentielWorld) {
    const actualDossierRaccordement = await mediator.send<ConsulterDossierRaccordementQuery>({
      type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.projetWorld.identifiantProjet,
        référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
      },
    });

    const expectedDossierRaccordement: DossierRaccordementReadModel = {
      dateQualification: this.raccordementWorld.dateQualification.toISOString(),
      accuséRéception: {
        format: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format,
      },
      référence: this.raccordementWorld.référenceDossierRaccordement,
      type: 'dossier-raccordement',
    };

    actualDossierRaccordement.should.be.deep.equal(expectedDossierRaccordement);

    const accuséRéception =
      await mediator.send<ConsulterAccuséRéceptionDemandeComplèteRaccordementQuery>({
        type: 'CONSULTER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT',
        data: {
          identifiantProjet: this.projetWorld.identifiantProjet,
          référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
        },
      });

    if (isNone(accuséRéception)) {
      throw new Error('Demande complète de raccordement non trouvée');
    }

    const actualFormat = accuséRéception.format;
    const expectedFormat = this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.format;

    actualFormat.should.be.equal(expectedFormat);

    const actualContent = await convertReadableToString(accuséRéception.content);
    const expectedContent =
      this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement.content;

    actualContent.should.be.equal(expectedContent);
  },
);

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet`,
  async function (this: PotentielWorld) {
    const actual = await mediator.send<ListerDossiersRaccordementQuery>({
      type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.projetWorld.identifiantProjet,
      },
    });

    actual.références.should.contain(this.raccordementWorld.référenceDossierRaccordement);
  },
);

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
import { ListerDossiersRaccordementQuery } from '@potentiel/domain-views';
import { convertStringToReadable } from '../helpers/convertStringToReadable';

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
        identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        dateQualification,
        accuséRéception,
      },
    });
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
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
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
          identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
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

// Quand(
//   `le porteur du projet transmet une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau`,
//   async function (this: PotentielWorld) {
//     try {
//       await mediator.send<DomainUseCase>({
//         type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
//         data: {
//           identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
//           identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(
//             this.gestionnaireRéseauWorld.codeEIC,
//           ),
//           référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
//             'une référence avec un format invalide',
//           ),
//           dateQualification: this.raccordementWorld.dateQualification,
//           accuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
//         },
//       });
//     } catch (e) {
//       this.error = e as Error;
//     }
//   },
// );

// Quand(
//   `le porteur du projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau non référencé`,
//   async function (this: PotentielWorld) {
//     try {
//       await mediator.send<DomainUseCase>({
//         type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
//         data: {
//           identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
//           identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(
//             'gestionnaire-de-réseau-inconnu',
//           ),
//           référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
//             this.raccordementWorld.référenceDossierRaccordement,
//           ),
//           dateQualification: this.raccordementWorld.dateQualification,
//           accuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
//         },
//       });
//     } catch (e) {
//       this.error = e as Error;
//     }
//   },
// );

Alors(
  'le projet devrait avoir {int} dossiers de raccordement pour ce gestionnaire de réseau',
  async function (this: PotentielWorld, nombreDeDemandes: number) {
    const actual = await mediator.send<ListerDossiersRaccordementQuery>({
      type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
      data: {
        identifiantProjet: this.raccordementWorld.identifiantProjet,
      },
    });

    actual.références.should.length(nombreDeDemandes);
  },
);

// EtantDonné(
//   `un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau`,
//   async function (this: PotentielWorld) {
//     await mediator.send<DomainUseCase>({
//       type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
//       data: {
//         identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
//         identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau('codeEICAutreGDR'),
//         dateQualification: new Date('2022-12-31'),
//         référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement('XXX-RP-2021-999999'),
//         accuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
//       },
//     });
//   },
// );

// Quand(
//   `le porteur du projet transmet une demande complète de raccordement auprès d'un autre gestionnaire de réseau`,
//   async function (this: PotentielWorld) {
//     const codeEICAutreGDR = 'UN-AUTRE-GDR';
//     await this.gestionnaireRéseauWorld.createGestionnaireRéseau(
//       codeEICAutreGDR,
//       'Un autre gestionnaire',
//     );

//     try {
//       await mediator.send<DomainUseCase>({
//         type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
//         data: {
//           identifiantProjet: convertirEnIdentifiantProjet(this.raccordementWorld.identifiantProjet),
//           identifiantGestionnaireRéseau:
//             convertirEnIdentifiantGestionnaireRéseau('codeEICAutreGDR'),
//           référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement('Enieme-DCR'),
//           dateQualification: new Date('2022-11-24'),
//           accuséRéception: this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement,
//         },
//       });
//     } catch (error) {
//       this.error = error as Error;
//     }
//   },
// );

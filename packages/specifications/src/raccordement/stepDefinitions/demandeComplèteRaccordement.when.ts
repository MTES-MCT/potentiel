import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';
import { mediator } from 'mediateur';
import { Raccordement } from '@potentiel-domain/reseau';
// import {
//   convertirEnDateTime,
//   DomainUseCase,
//   convertirEnIdentifiantProjet,
//   convertirEnIdentifiantGestionnaireRéseau,
//   convertirEnRéférenceDossierRaccordement,
//   IdentifiantProjet,
// } from '@potentiel/domain-usecases';
// import { mediator } from 'mediateur';
// import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';

// type DemandeComplèteRaccordement = {
//   identifiantProjet: IdentifiantProjet;
//   raisonSociale: string;
//   dateQualification: string | Date;
//   référenceDossierRaccordement: string;
//   format: string;
//   content: string;
// };

// const demandeComplèteRaccordementParDéfaut: Omit<
//   DemandeComplèteRaccordement,
//   'raisonSociale' | 'identifiantProjet'
// > = {
//   dateQualification: new Date(),
//   référenceDossierRaccordement: 'REF_DOSSIER',
//   format: 'application/pdf',
//   content: `Accusé de réception ayant pour référence REF_DOSSIER et la date de qualification au ${new Date().toISOString()}`,
// };

// Quand(
//   `un porteur transmet une demande complète de raccordement auprès du gestionnaire de réseau {string} pour le projet {string}`,
//   async function (this: PotentielWorld, raisonSociale: string, nomProjet: string) {
//     const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

//     await transmettreDemandeComplèteRaccordement(this, {
//       ...demandeComplèteRaccordementParDéfaut,
//       identifiantProjet,
//       raisonSociale,
//     });
//   },
// );

Quand(
  `le porteur transmet une demande complète de raccordement pour le projet lauréat {string} auprès du gestionnaire de réseau {string} avec :`,
  async function (
    this: PotentielWorld,
    nomProjet: string,
    raisonSocialeGestionnaire: string,
    table: DataTable,
  ) {
    const exemple = table.rowsHash();
    const dateQualification = new Date(exemple['La date de qualification']).toISOString();
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const accuséRéception = {
      format,
      content: convertStringToReadableStream(content),
    };

    const identifiantProjet = this.lauréatWorld
      .rechercherLauréatFixture(nomProjet)
      .identifiantProjet.formatter();

    const identifiantGestionnaireRéseau =
      raisonSocialeGestionnaire === 'Inconnu'
        ? 'Code EIC inconnu'
        : this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
            raisonSocialeGestionnaire,
          ).codeEIC;

    this.raccordementWorld.dateQualification = dateQualification;
    this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
      format,
      content,
    };

    try {
      await mediator.send<Raccordement.RaccordementUseCase>({
        type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          accuséRéceptionValue: accuséRéception,
          dateQualificationValue: dateQualification,
          identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
          identifiantProjetValue: identifiantProjet,
          référenceDossierValue: référenceDossierRaccordement,
        },
      });
    } catch (e) {
      console.log((e as Error).message);
      this.error = e as Error;
    }
  },
);

// const transmettreDemandeComplèteRaccordement = async (
//   world: PotentielWorld,
//   {
//     identifiantProjet,
//     raisonSociale,
//     dateQualification,
//     référenceDossierRaccordement,
//     content,
//     format,
//   }: DemandeComplèteRaccordement,
// ) => {
//   const dateQualificationValueType = convertirEnDateTime(dateQualification);
//   const accuséRéceptionContent =
//     content ??
//     `Accusé de réception ayant pour référence ${référenceDossierRaccordement} et la date de qualification au ${dateQualificationValueType.formatter()}`;

//   const accuséRéception = {
//     format,
//     content: convertStringToReadableStream(accuséRéceptionContent),
//   };

//   const codeEIC =
//     raisonSociale === 'Inconnu'
//       ? 'Code EIC inconnu'
//       : world.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale).codeEIC;

//   world.raccordementWorld.dateQualification = dateQualificationValueType;
//   world.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
//   world.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
//     format,
//     content: accuséRéceptionContent,
//   };

//   try {
//     await mediator.send<DomainUseCase>({
//       type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
//       data: {
//         identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
//         identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
//         référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
//           référenceDossierRaccordement,
//         ),
//         dateQualification: dateQualificationValueType,
//         accuséRéception,
//       },
//     });
//   } catch (e) {
//     world.error = e as Error;
//   }
// };

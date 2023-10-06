// import { Given as EtantDonné } from '@cucumber/cucumber';
// import { none } from '@potentiel/monads';
// import { PotentielWorld } from '../../../../potentiel.world';
// import { randomUUID } from 'crypto';
// import { executeQuery } from '@potentiel/pg-helpers';
// import { mediator } from 'mediateur';
// import {
//   DomainUseCase,
//   PiéceJustificativeAbandon,
//   convertirEnDateTime,
//   convertirEnIdentifiantProjet,
// } from '@potentiel/domain';
// import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';

// EtantDonné('le projet lauréat {string}', async function (this: PotentielWorld, nomProjet: string) {
//   await executeQuery(
//     `
//       insert into "projects" (
//         "id",
//         "appelOffreId",
//         "periodeId",
//         "numeroCRE",
//         "familleId",
//         "nomCandidat",
//         "nomProjet",
//         "puissance",
//         "prixReference",
//         "evaluationCarbone",
//         "note",
//         "nomRepresentantLegal",
//         "email",
//         "codePostalProjet",
//         "communeProjet",
//         "departementProjet",
//         "regionProjet",
//         "classe",
//         "isFinancementParticipatif",
//         "isInvestissementParticipatif",
//         "engagementFournitureDePuissanceAlaPointe"
//       )
//       values (
//         $1,
//         $2,
//         $3,
//         $4,
//         $5,
//         $6,
//         $7,
//         $8,
//         $9,
//         $10,
//         $11,
//         $12,
//         $13,
//         $14,
//         $15,
//         $16,
//         $17,
//         $18,
//         $19,
//         $20,
//         $21
//       )
//     `,
//     randomUUID(),
//     'PPE2 - Eolien',
//     '1',
//     '23',
//     '',
//     'nomCandidat',
//     nomProjet,
//     0,
//     0,
//     0,
//     0,
//     'nomRepresentantLegal',
//     'email',
//     'codePostalProjet',
//     'communeProjet',
//     'departementProjet',
//     'regionProjet',
//     'classé',
//     false,
//     false,
//     false,
//   );

//   this.lauréatWorld.lauréatFixtures.set(nomProjet, {
//     nom: nomProjet,
//     identifiantProjet: {
//       appelOffre: 'PPE2 - Eolien',
//       période: '1',
//       famille: none,
//       numéroCRE: '23',
//     },
//     projet: {
//       appelOffre: 'PPE2 - Eolien',
//       famille: '',
//       localité: {
//         commune: 'communeProjet',
//         département: 'departementProjet',
//         région: 'regionProjet',
//       },
//       nom: nomProjet,
//       numéroCRE: '23',
//       période: '1',
//       statut: 'classé',
//       type: 'projet',
//     },
//   });
// });

// EtantDonné(
//   `une demande d'abandon en cours pour le projet {string}`,
//   async function (this: PotentielWorld, nomProjet: string) {
//     const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

//     const piéceJustificative: PiéceJustificativeAbandon = {
//       format: `Le format de l'accusé de réception`,
//       content: convertStringToReadableStream(`Le contenu de l'accusé de réception`),
//     };

//     await mediator.send<DomainUseCase>({
//       type: 'DEMANDER_ABANDON_USECASE',
//       data: {
//         identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
//         piéceJustificative,
//         raison: `La raison de l'abandon`,
//         recandidature: false,
//         dateAbandon: convertirEnDateTime(new Date()),
//       },
//     });
//   },
// );

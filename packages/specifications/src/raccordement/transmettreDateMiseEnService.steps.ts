// import { When as Quand, Then as Alors } from '@cucumber/cucumber';
// import { PotentielWorld } from '../potentiel.world';
// import {
//   DomainUseCase,
//   convertirEnDateTime,
//   convertirEnIdentifiantProjet,
//   convertirEnRéférenceDossierRaccordement,
// } from '@potentiel/domain-usecases';
// import { expect } from 'chai';
// import { mediator } from 'mediateur';
// import { ConsulterDossierRaccordementQuery } from '@potentiel/domain-views';
// import { isNone } from '@potentiel/monads';

// Quand(
//   `le porteur transmet la date de mise en service {string} pour le dossier de raccordement ayant pour référence {string}`,
//   async function (
//     this: PotentielWorld,
//     dateMiseEnService: string,
//     référenceDossierRaccordement: string,
//   ) {
//     const dateMiseEnServiceValueType = convertirEnDateTime(dateMiseEnService);

//     this.raccordementWorld.dateMiseEnService = dateMiseEnServiceValueType;
//     this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;

//     try {
//       await mediator.send<DomainUseCase>({
//         type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
//         data: {
//           identifiantProjet: convertirEnIdentifiantProjet(this.lauréatWorld.identifiantProjet),
//           référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
//             référenceDossierRaccordement,
//           ),
//           dateMiseEnService: dateMiseEnServiceValueType,
//           dateDésignation: convertirEnDateTime(new Date('2020-01-01')),
//         },
//       });
//     } catch (e) {
//       this.error = e as Error;
//     }
//   },
// );

// Quand(
//   `le porteur transmet une date de mise en service antérieure à la date de notification du projet pour le dossier de raccordement ayant pour référence {string}`,
//   async function (this: PotentielWorld, référenceDossierRaccordement: string) {
//     const dateMiseEnService = convertirEnDateTime(new Date('2017-01-01'));
//     const dateDésignation = convertirEnDateTime(new Date('2020-01-01'));

//     this.raccordementWorld.dateMiseEnService = dateMiseEnService;
//     this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;

//     try {
//       await mediator.send<DomainUseCase>({
//         type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
//         data: {
//           identifiantProjet: convertirEnIdentifiantProjet(this.lauréatWorld.identifiantProjet),
//           référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
//             référenceDossierRaccordement,
//           ),
//           dateMiseEnService,
//           dateDésignation,
//         },
//       });
//     } catch (e) {
//       this.error = e as Error;
//     }
//   },
// );

// Alors(
//   `la date de mise en service {string} devrait être consultable dans le dossier de raccordement`,
//   async function (this: PotentielWorld, dateMiseEnService: string) {
//     const actual = await mediator.send<ConsulterDossierRaccordementQuery>({
//       type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
//       data: {
//         référenceDossierRaccordement: this.raccordementWorld.référenceDossierRaccordement,
//         identifiantProjet: this.lauréatWorld.identifiantProjet,
//       },
//     });

//     if (isNone(actual)) {
//       throw new Error('Dossier de raccordement non trouvé');
//     }

//     if (isNone(actual.miseEnService)) {
//       throw new Error('Date mise en service non trouvé');
//     }

//     expect(actual.miseEnService?.dateMiseEnService).to.equal(
//       new Date(dateMiseEnService).toISOString(),
//     );
//   },
// );

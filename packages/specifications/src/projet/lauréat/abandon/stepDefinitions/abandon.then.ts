// import { Then as Alors } from '@cucumber/cucumber';

// import { PotentielWorld } from '../../../../potentiel.world';
// import { loadAggregate } from '@potentiel/pg-event-sourcing';
// import { convertirEnIdentifiantProjet, loadAbandonAggregateFactory } from '@potentiel/domain';
// import { isNone, isSome } from '@potentiel/monads';
// import { mediator } from 'mediateur';
// import { ConsulterProjetQuery } from '@potentiel/domain-views/src/projet/consulter/consulterProjet.query';
// import {
//   ListerProjetEnAttenteRecandidatureQuery,
//   ConsulterPièceJustificativeAbandonProjetQuery,
// } from '@potentiel/domain-views';
// import { expect } from 'chai';
// import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

// Alors(
//   `la recandidature du projet {string} devrait être consultable dans la liste des projets lauréat abandonnés`,
//   async function (this: PotentielWorld, nomProjet: string) {
//     const lauréat = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

//     // Assert de l'aggrégat
//     const actualProjetAggregate = await loadAbandonAggregateFactory({
//       loadAggregate,
//     })(convertirEnIdentifiantProjet(lauréat.identifiantProjet));

//     if (isNone(actualProjetAggregate)) {
//       throw new Error(`L'agrégat abandon n'existe pas !`);
//     }

//     const actual = await mediator.send<ConsulterProjetQuery>({
//       type: 'CONSULTER_PROJET',
//       data: {
//         identifiantProjet: lauréat.identifiantProjet,
//       },
//     });

//     if (isNone(actual)) {
//       throw new Error('Projet non trouvée');
//     }

//     const pièceJustificativeAbandon =
//       await mediator.send<ConsulterPièceJustificativeAbandonProjetQuery>({
//         type: 'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
//         data: {
//           identifiantProjet: lauréat.identifiantProjet,
//         },
//       });

//     if (isNone(pièceJustificativeAbandon)) {
//       throw new Error('Pièce justificative non trouvée');
//     }

//     const actualFormat = pièceJustificativeAbandon.format;
//     const expectedFormat = this.lauréatWorld.abandonWorld.pièceJustificative.format;
//     actualFormat.should.be.equal(expectedFormat);

//     const actualContent = await convertReadableStreamToString(pièceJustificativeAbandon.content);
//     const expectedContent = this.lauréatWorld.abandonWorld.pièceJustificative.content;
//     actualContent.should.be.equal(expectedContent);

//     const expected = {
//       ...lauréat.projet,
//       pièceJustificative: {
//         format: expectedFormat,
//       },
//       statut: 'abandonné',
//       dateAbandon: this.lauréatWorld.abandonWorld.dateAbandon.toISOString(),
//       recandidature: this.lauréatWorld.abandonWorld.recandidature,
//     };

//     actual.should.be.deep.equal(expected);
//   },
// );

// Alors(
//   `le projet {string} devrait être disponible dans la liste des recandidatures attendues`,
//   async function (this: PotentielWorld, nomProjet: string) {
//     const lauréat = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

//     const listeRecandidatureEnAttente =
//       await mediator.send<ListerProjetEnAttenteRecandidatureQuery>({
//         type: 'LISTER_PROJET_EN_ATTENTE_RECANDIDATURE_QUERY',
//         data: {
//           pagination: {
//             itemsPerPage: 1,
//             page: 1,
//           },
//         },
//       });

//     const actual = listeRecandidatureEnAttente.items.find(
//       (r) =>
//         r.appelOffre === lauréat.identifiantProjet.appelOffre &&
//         r.période === lauréat.identifiantProjet.période &&
//         r.numéroCRE === lauréat.identifiantProjet.numéroCRE &&
//         r.famille ===
//           (isSome(lauréat.identifiantProjet.famille) ? lauréat.identifiantProjet.famille : ''),
//     );

//     expect(actual).to.be.not.undefined;
//   },
// );

// Alors(
//   `le projet {string} n'a plus de demande d'abandon en cours`,
//   async function (this: PotentielWorld, nomProjet: string) {
//     const lauréat = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

//     const actual = await mediator.send<ConsulterProjetQuery>({
//       type: 'CONSULTER_PROJET',
//       data: {
//         identifiantProjet: lauréat.identifiantProjet,
//       },
//     });

//     if (isNone(actual)) {
//       throw new Error('Projet non trouvée');
//     }

//     actual.should.be.deep.equal(lauréat.projet);
//   },
// );

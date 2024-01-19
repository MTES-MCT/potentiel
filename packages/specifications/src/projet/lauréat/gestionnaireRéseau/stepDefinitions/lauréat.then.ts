// import { Then as Alors } from '@cucumber/cucumber';

// import { expect } from 'chai';
// import { mediator } from 'mediateur';
// import { isNone } from '@potentiel/monads';

// import { PotentielWorld } from '../../../../potentiel.world';

// Alors(
//   `le projet {string} devrait avoir comme gestionnaire de réseau {string}`,
//   async function (this: PotentielWorld, nomProjet: string, raisonSociale: string) {
//     const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
//     const { codeEIC } =
//       this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

//     // Assert on read model
//     const résultat = await mediator.send<ConsulterGestionnaireRéseauLauréatQuery>({
//       type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_LAURÉAT_QUERY',
//       data: {
//         identifiantProjet,
//       },
//     });

//     if (isNone(résultat)) {
//       throw new Error('Projet non trouvé');
//     }

//     expect(résultat.identifiantGestionnaire).to.deep.equal({
//       codeEIC,
//     });
//   },
// );

// import { Create, Remove, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
// import { isNone } from '@potentiel/monads';
// import { DossierRaccordementReadModel } from '../../consulter/dossierRaccordement.readModel';
// import { DemandeComplèteRaccordementModifiéeEvent } from '../PropositionTechniqueEtFinancièreModifiée.event';
// import { ListeDossiersRaccordementReadModel } from '../../lister/listeDossierRaccordement.readModel';

// export const demandeComplèteRaccordementeModifiéeHandlerFactory: DomainEventHandlerFactory<
//   DemandeComplèteRaccordementModifiéeEvent,
//   {
//     find: Find;
//     create: Create;
//     remove: Remove;
//     update: Update;
//   }
// > =
//   ({ find, create, remove, update }) =>
//   async (event) => {
//     const dossierRaccordement = await find<DossierRaccordementReadModel>(
//       `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
//     );

//     if (isNone(dossierRaccordement)) {
//       // TODO ajouter un log ici
//       return;
//     }

//     await create<DossierRaccordementReadModel>(
//       `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.nouvelleReference}`,
//       {
//         ...dossierRaccordement,
//         dateQualification: event.payload.dateQualification,
//         référence: event.payload.nouvelleReference,
//       },
//     );

//     await remove<DossierRaccordementReadModel>(
//       `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
//     );

//     const listeDossierRaccordement = await find<ListeDossiersRaccordementReadModel>(
//       `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
//     );

//     if (isNone(listeDossierRaccordement)) {
//       // TODO ajouter un log ici
//       return;
//     }

//     await update<ListeDossiersRaccordementReadModel>(
//       `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
//       {
//         ...listeDossierRaccordement,
//         références: [
//           ...listeDossierRaccordement.références.filter(
//             (référence) => référence !== event.payload.referenceActuelle,
//           ),
//           event.payload.nouvelleReference,
//         ],
//       },
//     );
//   };

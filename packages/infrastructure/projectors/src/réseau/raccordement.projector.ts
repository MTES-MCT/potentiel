import { Raccordement } from '@potentiel-domain/reseau';
import { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Message, MessageHandler, mediator } from 'mediateur';
import { removeProjection } from '../utils/removeProjection';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { isNone, isSome } from '@potentiel/monads';
import { IdentifiantGestionnaireRéseau } from '@potentiel-domain/reseau/src/gestionnaire';
import { upsertProjection } from '../utils/upsertProjection';

export type SubscriptionEvent = (Raccordement.RaccordementEvent & Event) | RebuildTriggered;

export type Execute = Message<'EXECUTE_RACCORDEMENT_PROJECTOR', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      const raccordement = await findProjection<Raccordement.RaccordementEntity>(
        `raccordement|${payload.id}`,
      );

      if (!isNone(raccordement)) {
        for (const référence of raccordement.demandes.map((d) => d.référence)) {
          await removeProjection<Raccordement.DossierRaccordementEntity>(
            `dossier-raccordement|${payload.id}#${référence}`,
          );
          await removeProjection<Raccordement.RéférenceRaccordementIdentifiantProjetEntity>(
            `référence-raccordement-projet|${référence}`,
          );
        }

        await removeProjection<Raccordement.RaccordementEntity>(`raccordement|${payload.id}`);
      }
    } else {
      const { identifiantProjet } = payload;
      const raccordement = await findProjection<Raccordement.RaccordementEntity>(
        `raccordement|${event.payload.identifiantProjet}`,
      );

      const raccordementDefaultValue: Omit<Raccordement.RaccordementEntity, 'type'> = {
        identifiantProjet,
        nomProjet: '',
        appelOffre: '',
        période: '',
        famille: undefined,
        numéroCRE: '',
        demandes: [],
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu.formatter(),
      };

      const raccordementToUpsert: Omit<Raccordement.RaccordementEntity, 'type'> = isSome(
        raccordement,
      )
        ? raccordement
        : raccordementDefaultValue;

      switch (event.type) {
        case 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1':
          break;
        case 'DateMiseEnServiceTransmise-V1':
          break;
        case 'DemandeComplèteDeRaccordementTransmise-V1':
          await upsertProjection<Raccordement.RaccordementEntity>(
            `raccordement|${event.payload.identifiantProjet}`,
            {
              ...raccordementToUpsert,
              identifiantGestionnaireRéseau: event.payload.identifiantGestionnaireRéseau,
              demandes: [
                ...raccordementToUpsert.demandes,
                {
                  référence: event.payload.référenceDossierRaccordement,
                  demandeComplèteRaccordement: {
                    dateQualification: event.payload.dateQualification,
                  },
                },
              ],
            },
          );

          await upsertProjection<Raccordement.DossierRaccordementEntity>(
            `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
            {
              référence: event.payload.référenceDossierRaccordement,
              demandeComplèteRaccordement: {
                dateQualification: event.payload.dateQualification,
              },
            },
          );

          await upsertProjection<Raccordement.RéférenceRaccordementIdentifiantProjetEntity>(
            `référence-raccordement-projet|${event.payload.référenceDossierRaccordement}`,
            {
              identifiantProjet: event.payload.identifiantProjet,
              référence: event.payload.référenceDossierRaccordement,
            },
          );
          break;
        case 'DemandeComplèteDeRaccordementTransmise-V2':
          break;
        case 'DemandeComplèteRaccordementModifiée-V1':
          break;
        case 'DemandeComplèteRaccordementModifiée-V2':
          break;
        case 'DemandeComplèteRaccordementModifiée-V3':
          break;
        case 'GestionnaireRéseauRaccordementModifié-V1':
          await upsertProjection(`raccordement|${event.payload.identifiantProjet}`, {
            ...raccordementToUpsert,
            IdentifiantGestionnaireRéseau: event.payload.identifiantGestionnaireRéseau,
          });
          break;
        case 'PropositionTechniqueEtFinancièreModifiée-V1':
          break;
        case 'PropositionTechniqueEtFinancièreModifiée-V2':
          break;
        case 'PropositionTechniqueEtFinancièreSignéeTransmise-V1':
          break;
        case 'PropositionTechniqueEtFinancièreTransmise-V1':
          break;
        case 'PropositionTechniqueEtFinancièreTransmise-V2':
          break;
        case 'RéférenceDossierRacordementModifiée-V1':
          break;
      }
    }
  };

  mediator.register('EXECUTE_RACCORDEMENT_PROJECTOR', handler);
};

// import { Message, MessageHandler, mediator } from 'mediateur';
// import { RaccordementEvent } from '@potentiel/domain-usecases';
// import { isNone } from '@potentiel/monads';
// import {
//   LegacyDossierRaccordementReadModel,
//   ListeDossiersRaccordementReadModel,
// } from './raccordement.readModel';
// import {
//   Create,
//   Find,
//   RebuildTriggered,
//   Remove,
//   Search,
//   Update,
// } from '@potentiel/core-domain-views';

// export type ExecuteRaccordementProjector = Message<
//   'EXECUTE_RACCORDEMENT_PROJECTOR',
//   RaccordementEvent | RebuildTriggered
// >;

// export type RaccordementProjectorDependencies = {
//   find: Find;
//   update: Update;
//   create: Create;
//   remove: Remove;
//   search: Search;
// };

// export const registerRaccordementProjector = ({
//   create,
//   find,
//   remove,
//   update,
//   search,
// }: RaccordementProjectorDependencies) => {
//   const handler: MessageHandler<ExecuteRaccordementProjector> = async (event) => {
//     if (event.type === 'RebuildTriggered') {
//       await remove<ListeDossiersRaccordementReadModel>(
//         `liste-dossiers-raccordement|${event.payload.id}`,
//       );
//       const dossiers = await search<LegacyDossierRaccordementReadModel>(
//         `dossiers-raccordement|${event.payload.id}#%`,
//       );

//       for (const dossier of dossiers) {
//         await remove(`dossiers-raccordement|${event.payload.id}#${dossier.readModel.référence}`);
//       }
//     } else {
//       if (event.type === 'DemandeComplèteDeRaccordementTransmise-V1') {
//         const dossierRaccordement = await find<LegacyDossierRaccordementReadModel>(
//           `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
//         );

//         if (isNone(dossierRaccordement)) {
//           await create<LegacyDossierRaccordementReadModel>(
//             `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
//             {
//               dateQualification: event.payload.dateQualification,
//               référence: event.payload.référenceDossierRaccordement,
//             },
//           );
//         }

//         const listeDossierRaccordement = await find<ListeDossiersRaccordementReadModel>(
//           `liste-dossiers-raccordement|${event.payload.identifiantProjet}`,
//         );

//         if (isNone(listeDossierRaccordement)) {
//           await create<ListeDossiersRaccordementReadModel>(
//             `liste-dossiers-raccordement|${event.payload.identifiantProjet}`,
//             {
//               références: [event.payload.référenceDossierRaccordement],
//             },
//           );
//         } else {
//           await update<ListeDossiersRaccordementReadModel>(
//             `liste-dossiers-raccordement|${event.payload.identifiantProjet}`,
//             {
//               ...listeDossierRaccordement,
//               références: [
//                 ...new Set([
//                   ...listeDossierRaccordement.références,
//                   event.payload.référenceDossierRaccordement,
//                 ]),
//               ],
//             },
//           );
//         }
//       } else {
//         const référence =
//           event.type === 'DemandeComplèteRaccordementModifiée-V1'
//             ? event.payload.referenceActuelle
//             : event.type === 'RéférenceDossierRacordementModifiée-V1'
//             ? event.payload.référenceDossierRaccordementActuelle
//             : event.payload.référenceDossierRaccordement;

//         const dossierRaccordement = await find<LegacyDossierRaccordementReadModel>(
//           `dossier-raccordement|${event.payload.identifiantProjet}#${référence}`,
//         );

//         if (isNone(dossierRaccordement)) {
//           // TODO: logger error
//           return;
//         }

//         switch (event.type) {
//           case 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1':
//             await update<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${référence}`,
//               {
//                 ...dossierRaccordement,
//                 accuséRéception: {
//                   format: event.payload.format,
//                 },
//               },
//             );
//             break;
//           case 'DateMiseEnServiceTransmise-V1':
//             await update<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
//               {
//                 ...dossierRaccordement,
//                 dateMiseEnService: event.payload.dateMiseEnService,
//               },
//             );
//             break;
//           case 'DemandeComplèteRaccordementModifiée-V1':
//             await remove<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
//             );

//             await create<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.nouvelleReference}`,
//               {
//                 ...dossierRaccordement,
//                 dateQualification: event.payload.dateQualification,
//                 référence: event.payload.nouvelleReference,
//               },
//             );

//             const listeDossierRaccordement = await find<ListeDossiersRaccordementReadModel>(
//               `liste-dossiers-raccordement|${event.payload.identifiantProjet}`,
//             );

//             if (isNone(listeDossierRaccordement)) {
//               // TODO ajouter un log ici
//               return;
//             }

//             if (event.payload.nouvelleReference !== event.payload.referenceActuelle) {
//               await update<ListeDossiersRaccordementReadModel>(
//                 `liste-dossiers-raccordement|${event.payload.identifiantProjet}`,
//                 {
//                   ...listeDossierRaccordement,
//                   références: [
//                     ...new Set([
//                       ...listeDossierRaccordement.références.filter(
//                         (référence) => référence !== event.payload.referenceActuelle,
//                       ),
//                       event.payload.nouvelleReference,
//                     ]),
//                   ],
//                 },
//               );
//             }
//             break;
//           case 'DemandeComplèteRaccordementModifiée-V2':
//             await update<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${référence}`,
//               {
//                 ...dossierRaccordement,
//                 dateQualification: event.payload.dateQualification,
//               },
//             );
//             break;
//           case 'RéférenceDossierRacordementModifiée-V1':
//             await remove<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordementActuelle}`,
//             );

//             await create<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.nouvelleRéférenceDossierRaccordement}`,
//               {
//                 ...dossierRaccordement,
//                 référence: event.payload.nouvelleRéférenceDossierRaccordement,
//               },
//             );

//             const dossiers = await find<ListeDossiersRaccordementReadModel>(
//               `liste-dossiers-raccordement|${event.payload.identifiantProjet}`,
//             );

//             if (isNone(dossiers)) {
//               // TODO ajouter un log ici
//               return;
//             }
//             await update<ListeDossiersRaccordementReadModel>(
//               `liste-dossiers-raccordement|${event.payload.identifiantProjet}`,
//               {
//                 ...dossiers,
//                 références: [
//                   ...new Set([
//                     ...dossiers.références.filter(
//                       (référence) =>
//                         référence !== event.payload.référenceDossierRaccordementActuelle,
//                     ),
//                     event.payload.nouvelleRéférenceDossierRaccordement,
//                   ]),
//                 ],
//               },
//             );
//             break;
//           case 'PropositionTechniqueEtFinancièreModifiée-V1':
//             await update<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
//               {
//                 ...dossierRaccordement,
//                 propositionTechniqueEtFinancière: {
//                   dateSignature: event.payload.dateSignature,
//                   format: dossierRaccordement.propositionTechniqueEtFinancière!.format,
//                 },
//               },
//             );
//             break;
//           case 'PropositionTechniqueEtFinancièreSignéeTransmise-V1':
//             await update<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
//               {
//                 ...dossierRaccordement,
//                 ...(dossierRaccordement.propositionTechniqueEtFinancière && {
//                   propositionTechniqueEtFinancière: {
//                     ...dossierRaccordement.propositionTechniqueEtFinancière,
//                     format: event.payload.format,
//                   },
//                 }),
//               },
//             );
//             break;
//           case 'PropositionTechniqueEtFinancièreTransmise-V1':
//             await update<LegacyDossierRaccordementReadModel>(
//               `dossier-raccordement|${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
//               {
//                 ...dossierRaccordement,
//                 propositionTechniqueEtFinancière: {
//                   dateSignature: event.payload.dateSignature,
//                   format: 'none',
//                 },
//               },
//             );
//             break;
//         }
//       }
//     }
//   };
//   mediator.register('EXECUTE_RACCORDEMENT_PROJECTOR', handler);
// };

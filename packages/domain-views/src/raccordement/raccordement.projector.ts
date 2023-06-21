import { Message, MessageHandler, mediator } from 'mediateur';
import { RaccordementEvent } from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import {
  LegacyDossierRaccordementReadModel,
  ListeDossiersRaccordementReadModel,
} from './raccordement.readModel';
import { Create, Find, Remove, Update } from '../common.port';

export type ExecuteRaccordementProjector = Message<
  'EXECUTE_RACCORDEMENT_PROJECTOR',
  RaccordementEvent
>;

export type RaccordementProjectorDependencies = {
  find: Find;
  update: Update;
  create: Create;
  remove: Remove;
};

export const registerRaccordementProjector = ({
  create,
  find,
  remove,
  update,
}: RaccordementProjectorDependencies) => {
  const handler: MessageHandler<ExecuteRaccordementProjector> = async (event) => {
    if (event.type === 'DemandeComplèteDeRaccordementTransmise') {
      await create<LegacyDossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
        {
          dateQualification: event.payload.dateQualification,
          référence: event.payload.référenceDossierRaccordement,
        },
      );

      const listeDossierRaccordement = await find<ListeDossiersRaccordementReadModel>(
        `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
      );

      if (isNone(listeDossierRaccordement)) {
        await create<ListeDossiersRaccordementReadModel>(
          `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
          {
            références: [event.payload.référenceDossierRaccordement],
          },
        );
      } else {
        await update<ListeDossiersRaccordementReadModel>(
          `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
          {
            ...listeDossierRaccordement,
            références: [
              ...listeDossierRaccordement.références,
              event.payload.référenceDossierRaccordement,
            ],
          },
        );
      }
    } else {
      const référence =
        event.type === 'DemandeComplèteRaccordementModifiée'
          ? event.payload.referenceActuelle
          : event.type === 'RéférenceDossierRacordementModifiée-V1'
          ? event.payload.référenceDossierRaccordementActuelle
          : event.payload.référenceDossierRaccordement;

      const dossierRaccordement = await find<LegacyDossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.identifiantProjet}#${référence}`,
      );

      if (isNone(dossierRaccordement)) {
        // TODO: logger error
        return;
      }

      switch (event.type) {
        case 'AccuséRéceptionDemandeComplèteRaccordementTransmis':
          await update<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${référence}`,
            {
              ...dossierRaccordement,
              accuséRéception: {
                format: event.payload.format,
              },
            },
          );
          break;
        case 'DateMiseEnServiceTransmise':
          await update<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
            {
              ...dossierRaccordement,
              dateMiseEnService: event.payload.dateMiseEnService,
            },
          );
          break;
        case 'DemandeComplèteRaccordementModifiée':
          await remove<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
          );

          await create<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.nouvelleReference}`,
            {
              ...dossierRaccordement,
              dateQualification: event.payload.dateQualification,
              référence: event.payload.nouvelleReference,
            },
          );

          const listeDossierRaccordement = await find<ListeDossiersRaccordementReadModel>(
            `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
          );

          if (isNone(listeDossierRaccordement)) {
            // TODO ajouter un log ici
            return;
          }

          if (event.payload.nouvelleReference !== event.payload.referenceActuelle) {
            await update<ListeDossiersRaccordementReadModel>(
              `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
              {
                ...listeDossierRaccordement,
                références: [
                  ...listeDossierRaccordement.références.filter(
                    (référence) => référence !== event.payload.referenceActuelle,
                  ),
                  event.payload.nouvelleReference,
                ],
              },
            );
          }
          break;
        case 'DemandeComplèteRaccordementModifiée-V1':
          await update<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${référence}`,
            {
              ...dossierRaccordement,
              dateQualification: event.payload.dateQualification,
            },
          );
          break;
        case 'RéférenceDossierRacordementModifiée-V1':
          await remove<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordementActuelle}`,
          );

          await create<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.nouvelleRéférenceDossierRaccordement}`,
            {
              ...dossierRaccordement,
              référence: event.payload.nouvelleRéférenceDossierRaccordement,
            },
          );

          const dossiers = await find<ListeDossiersRaccordementReadModel>(
            `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
          );

          if (isNone(dossiers)) {
            // TODO ajouter un log ici
            return;
          }
          await update<ListeDossiersRaccordementReadModel>(
            `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
            {
              ...dossiers,
              références: [
                ...dossiers.références.filter(
                  (référence) => référence !== event.payload.référenceDossierRaccordementActuelle,
                ),
                event.payload.nouvelleRéférenceDossierRaccordement,
              ],
            },
          );
          break;
        case 'PropositionTechniqueEtFinancièreModifiée':
          await update<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
            {
              ...dossierRaccordement,
              propositionTechniqueEtFinancière: {
                dateSignature: event.payload.dateSignature,
                format: dossierRaccordement.propositionTechniqueEtFinancière!.format,
              },
            },
          );
          break;
        case 'PropositionTechniqueEtFinancièreSignéeTransmise':
          await update<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
            {
              ...dossierRaccordement,
              ...(dossierRaccordement.propositionTechniqueEtFinancière && {
                propositionTechniqueEtFinancière: {
                  ...dossierRaccordement.propositionTechniqueEtFinancière,
                  format: event.payload.format,
                },
              }),
            },
          );
          break;
        case 'PropositionTechniqueEtFinancièreTransmise':
          await update<LegacyDossierRaccordementReadModel>(
            `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
            {
              ...dossierRaccordement,
              propositionTechniqueEtFinancière: {
                dateSignature: event.payload.dateSignature,
                format: 'none',
              },
            },
          );
          break;
      }
    }
  };
  mediator.register('EXECUTE_RACCORDEMENT_PROJECTOR', handler);
};

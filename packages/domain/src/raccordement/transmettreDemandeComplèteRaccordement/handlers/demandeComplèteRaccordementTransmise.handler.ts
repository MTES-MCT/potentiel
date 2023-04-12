import { Create, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone, isSome } from '@potentiel/monads';
import { DemandeComplèteRaccordementTransmiseEvent } from '../demandeComplèteRaccordementTransmise.event';
import { GestionnaireRéseauReadModel } from '../../../gestionnaireRéseau';
import { DossierRaccordementReadModel } from '../../consulter/dossierRaccordement.readModel';
import { ListeDossiersRaccordementReadModel } from '../../lister/listeDossierRaccordement.readModel';

export const demandeComplèteRaccordementTransmiseHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementTransmiseEvent,
  {
    create: Create;
    update: Update;
    find: Find;
  }
> =
  ({ create, update, find }) =>
  async (event) => {
    const gestionnaireRéseau = await find<GestionnaireRéseauReadModel>(
      `gestionnaire-réseau#${event.payload.identifiantGestionnaireRéseau}`,
    );

    if (isSome(gestionnaireRéseau)) {
      await create<DossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.référenceDossierRaccordement}`,
        {
          dateQualification: event.payload.dateQualification,
          référence: event.payload.référenceDossierRaccordement,
          gestionnaireRéseau,
        },
      );

      const listeDemandeComplèteRaccordement = await find<ListeDossiersRaccordementReadModel>(
        `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
      );

      if (isNone(listeDemandeComplèteRaccordement)) {
        await create<ListeDossiersRaccordementReadModel>(
          `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
          {
            gestionnaireRéseau,
            références: [event.payload.référenceDossierRaccordement],
          },
        );
      } else {
        await update<ListeDossiersRaccordementReadModel>(
          `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
          {
            ...listeDemandeComplèteRaccordement,
            références: [
              ...listeDemandeComplèteRaccordement.références,
              event.payload.référenceDossierRaccordement,
            ],
          },
        );
      }
    } else {
      // TODO: logguer au cas où
    }
  };

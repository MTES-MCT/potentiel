import { Create, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone, isSome } from '@potentiel/monads';
import { DemandeComplèteRaccordementTransmiseEvent } from '../demandeComplèteRaccordementTransmise.event';
import { GestionnaireRéseauReadModel } from '../../../../gestionnaireRéseau';
import { DossierRaccordementReadModel } from '../../consulter/dossierRaccordement.readModel';
import { ListeDemandeComplèteRaccordementReadModel } from '../../lister/listeDemandeComplèteRaccordement.readModel';

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
        `demande-complète-raccordement#${event.payload.référenceDemandeRaccordement}`,
        {
          dateQualification: event.payload.dateQualification,
          référenceDemandeRaccordement: event.payload.référenceDemandeRaccordement,
          gestionnaireRéseau,
        },
      );

      const listeDemandeComplèteRaccordement =
        await find<ListeDemandeComplèteRaccordementReadModel>(
          `liste-demande-complète-raccordement#${event.payload.identifiantProjet}`,
        );

      if (isNone(listeDemandeComplèteRaccordement)) {
        await create<ListeDemandeComplèteRaccordementReadModel>(
          `liste-demande-complète-raccordement#${event.payload.identifiantProjet}`,
          {
            gestionnaireRéseau,
            référencesDemandeRaccordement: [event.payload.référenceDemandeRaccordement],
          },
        );
      } else {
        await update<ListeDemandeComplèteRaccordementReadModel>(
          `liste-demande-complète-raccordement#${event.payload.identifiantProjet}`,
          {
            ...listeDemandeComplèteRaccordement,
            référencesDemandeRaccordement: [
              ...listeDemandeComplèteRaccordement.référencesDemandeRaccordement,
              event.payload.référenceDemandeRaccordement,
            ],
          },
        );
      }
    } else {
      // TODO: logguer au cas où
    }
  };
